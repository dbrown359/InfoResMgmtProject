/* ACCOUNTADAY — SHARED JAVASCRIPT
   This script is loaded with "defer" on every page. Each feature first checks
   for its own HTML element, so it only runs on the page that needs it.
   An immediately invoked function keeps variables out of the global scope. */
(() => {
  'use strict';

  // 1. MOBILE MENU: aria-expanded tells assistive technology whether it is open.
  // The links are present in HTML, so navigation also works without JavaScript.
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  if (menuButton && navigation) {
    document.documentElement.classList.add('js-nav');
    menuButton.hidden = false;
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    // Reset the mobile state when switching between desktop and narrow layouts.
    window.matchMedia('(max-width: 800px)').addEventListener('change', closeMenu);
  }

  // 2. DAILY PLANNER: one array is the source of truth. Rendering displays it;
  // persistence saves it; the report calculates totals from the same records.
  const planner = document.querySelector('#planner-app');
  if (planner) {
    planner.hidden = false;
    const storageKey = 'accountaday.tasks.v1';
    const statuses = ['Planned', 'Completed', 'Skipped', 'Delayed', 'Rescheduled'];
    const priorities = ['High', 'Medium', 'Low'];
    const taskList = document.querySelector('#task-list');
    const taskForm = document.querySelector('#task-form');
    const taskInput = document.querySelector('#task-name');
    const priorityInput = document.querySelector('#task-priority');
    const feedback = document.querySelector('#task-feedback');
    const storageNote = document.querySelector('#storage-note');
    const sampleTasks = () => [
      { id: 'sample-1', title: 'Set today’s top three priorities', priority: 'High', status: 'Completed' },
      { id: 'sample-2', title: 'Spend 30 minutes on a meaningful project', priority: 'High', status: 'Planned' },
      { id: 'sample-3', title: 'Take a screen-free walk', priority: 'Medium', status: 'Planned' },
      { id: 'sample-4', title: 'Reflect and plan for tomorrow', priority: 'Low', status: 'Planned' }
    ];
    let tasks = sampleTasks();
    // Storage can be blocked in private browsing or for file:// pages. Failure
    // must not break the demo. Data then lives only until this page is closed.
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        // Validate stored data before trusting it: it may be stale or edited.
        const valid = Array.isArray(parsed) && parsed.length <= 100 && parsed.every(task =>
          task && typeof task.id === 'string' && typeof task.title === 'string' &&
          task.title.trim().length > 0 && task.title.length <= 100 &&
          priorities.includes(task.priority) && statuses.includes(task.status)
        ) && new Set(parsed.map(task => task.id)).size === parsed.length;
        if (!valid) throw new Error('Invalid saved task data');
        tasks = parsed;
      }
    } catch (error) {
      storageNote.textContent = 'Saved tasks could not be loaded. The demo is using sample tasks; browser storage may be unavailable.';
    }
    function saveTasks() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
      } catch (error) {
        storageNote.textContent = 'Browser storage is unavailable. Your changes work here but may be lost when you close or reload this page.';
      }
    }
    // Count all states. Only Completed counts as success; skipped and delayed
    // tasks stay in the denominator, keeping the accountability report honest.
    function getReport() {
      const counts = Object.fromEntries(statuses.map(status => [status, 0]));
      tasks.forEach(task => counts[task.status]++);
      const percentage = tasks.length ? Math.round(counts.Completed / tasks.length * 100) : 0;
      return { counts, percentage, total: tasks.length };
    }
    function updateReport() {
      const report = getReport();
      document.querySelector('#completion-percent').textContent = `${report.percentage}%`;
      const progress = document.querySelector('#completion-progress');
      progress.value = report.percentage;
      progress.textContent = `${report.percentage}%`;
      document.querySelector('#report-summary').textContent = report.total
        ? `${report.counts.Completed} of ${report.total} tasks completed. ${report.total - report.counts.Completed} still need a next step.`
        : 'A fresh start. Add a task to build your plan.';
      const counts = document.querySelector('#status-counts');
      counts.replaceChildren();
      statuses.forEach(status => {
        const term = document.createElement('dt');
        const value = document.createElement('dd');
        term.textContent = status;
        value.textContent = report.counts[status];
        counts.append(term, value);
      });
    }
    function renderTasks() {
      taskList.replaceChildren();
      if (!tasks.length) {
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = 'Your plan is clear. Add your first commitment above.';
        taskList.append(empty);
      }
      tasks.forEach(task => {
        const row = document.createElement('li');
        row.className = 'task-row';
        row.dataset.status = task.status;
        const details = document.createElement('div');
        const title = document.createElement('span');
        title.className = 'task-title';
        // textContent treats user input as text, never executable HTML.
        title.textContent = task.title;
        const priority = document.createElement('span');
        priority.className = 'task-priority';
        priority.textContent = `${task.priority} priority`;
        details.append(title, priority);
        const select = document.createElement('select');
        select.setAttribute('aria-label', `Status for ${task.title}`);
        statuses.forEach(status => {
          const option = document.createElement('option');
          option.value = status;
          option.textContent = status;
          select.append(option);
        });
        select.value = task.status;
        select.addEventListener('change', () => {
          task.status = select.value;
          row.dataset.status = task.status;
          saveTasks();
          updateReport();
          // Only update the report here, retaining keyboard focus on the select.
          feedback.textContent = `${task.title}: ${task.status}.`;
        });
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'delete-task';
        remove.textContent = '×';
        remove.setAttribute('aria-label', `Remove ${task.title}`);
        remove.addEventListener('click', () => {
          tasks = tasks.filter(item => item.id !== task.id);
          saveTasks();
          renderTasks();
          taskInput.focus();
          feedback.textContent = `Removed “${task.title}”.`;
        });
        row.append(details, select, remove);
        taskList.append(row);
      });
      updateReport();
    }
    taskInput.addEventListener('input', () => taskInput.setCustomValidity(''));
    taskForm.addEventListener('submit', event => {
      event.preventDefault(); // Keep the visitor on this page instead of submitting.
      const title = taskInput.value.trim();
      if (!title) {
        taskInput.setCustomValidity('Enter a task, not just spaces.');
        taskInput.reportValidity();
        return;
      }
      if (tasks.length >= 100) {
        feedback.textContent = 'This demo holds up to 100 tasks. Remove a task before adding another.';
        return;
      }
      // Date + random suffix creates an ID without relying on a secure origin.
      tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title,
        priority: priorityInput.value, status: 'Planned' });
      saveTasks();
      renderTasks();
      taskInput.value = '';
      taskInput.focus();
      feedback.textContent = `Added “${title}”.`;
    });
    document.querySelector('#sort-tasks').addEventListener('click', () => {
      tasks.sort((a, b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority));
      saveTasks();
      renderTasks();
      feedback.textContent = 'Tasks ordered from high to low priority. This demo does not assign times or deadlines.';
    });
    document.querySelector('#reset-demo').addEventListener('click', () => {
      // Reset replaces the current list, so confirm before removing personal tasks.
      if (!window.confirm('Replace your current task list with the four sample tasks?')) return;
      tasks = sampleTasks();
      saveTasks();
      renderTasks();
      feedback.textContent = 'Sample tasks restored.';
    });
    document.querySelector('#download-report').addEventListener('click', () => {
      const report = getReport();
      const lines = ['ACCOUNTADAY — DAILY ACCOUNTABILITY REPORT', 'Plan it. Do it. Own it.',
        `Generated: ${new Date().toLocaleString()}`, '',
        `Completed: ${report.counts.Completed} / ${report.total} (${report.percentage}%)`,
        ...statuses.map(status => `${status}: ${report.counts[status]}`), '', 'YOUR TASKS',
        ...tasks.map(task => `[${task.status}] ${task.title} (${task.priority} priority)`), '',
        'REFLECTION', 'What helped you follow through?', 'What will you adjust tomorrow?', '',
        'Local demo snapshot only; this is not a historical or weekly report.'];
      // A Blob packages text into a downloadable file entirely inside the browser.
      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AccountaDay-daily-report.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000); // Release temporary memory.
      feedback.textContent = 'Your report download has been started.';
    });
    renderTasks();
  }

  // 3. GALLERY: enhance normal image links into an accessible modal preview.
  // If dialog is unsupported, links simply open their original SVG images.
  const lightbox = document.querySelector('#lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    let lastTrigger = null;
    document.querySelectorAll('.gallery-link').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        lastTrigger = link;
        const image = document.querySelector('#lightbox-image');
        image.src = link.getAttribute('href');
        image.alt = link.querySelector('img').alt;
        document.querySelector('#lightbox-caption').textContent = link.dataset.caption;
        lightbox.showModal();
      });
    });
    document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
    // Escape closes native dialogs automatically; the close event runs either way.
    lightbox.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
    lightbox.addEventListener('click', event => {
      const box = lightbox.getBoundingClientRect();
      if (event.target === lightbox && (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom)) lightbox.close();
    });
  }

  // 4. CONTACT VALIDATION: no backend, network request, or email is involved.
  // The submit button is disabled in HTML until this handler is installed.
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const status = document.querySelector('#form-status');
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    function errorFor(id) {
      const field = document.getElementById(id);
      const value = field.value.trim();
      if (id === 'name' && !value) return 'Please enter your name.';
      if (id === 'email' && (!value || field.validity.typeMismatch)) return 'Please enter a valid email address.';
      if (id === 'phone' && value && (!/^[+()\d\s.\-]+$/.test(value) || value.replace(/\D/g, '').length < 7)) return 'Use a phone number with at least 7 digits, or leave this blank.';
      if (id === 'subject' && !value) return 'Please choose a topic.';
      if (id === 'message' && (value.length < 10 || value.length > 2000)) return 'Please write a message between 10 and 2,000 characters.';
      return '';
    }
    function displayError(id, message) {
      document.getElementById(`${id}-error`).textContent = message;
      document.getElementById(id).setAttribute('aria-invalid', String(Boolean(message)));
    }
    fields.forEach(id => {
      const field = document.getElementById(id);
      field.addEventListener('input', () => {
        // Re-check edited fields after a failed submission, without nagging on load.
        if (field.getAttribute('aria-invalid') === 'true') displayError(id, errorFor(id));
        status.textContent = '';
        status.classList.remove('success');
      });
    });
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      let firstInvalid = null;
      fields.forEach(id => {
        const error = errorFor(id);
        displayError(id, error);
        if (error && !firstInvalid) firstInvalid = document.getElementById(id);
      });
      status.classList.remove('success');
      if (firstInvalid) {
        status.textContent = 'Please correct the highlighted fields and check your message again.';
        firstInvalid.focus();
      } else {
        status.textContent = 'Your entries look good! This demo has not sent or saved your message. Thanks for trying AccountaDay.';
        status.classList.add('success');
      }
    });
    document.querySelector('#contact-submit').disabled = false;
  }
})();
