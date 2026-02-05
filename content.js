function addMilestonesTab() {
  const pathParts = window.location.pathname.split('/').filter(part => part);
  if (pathParts.length < 2) return;

  const navSelectors = [
    'li.prc-UnderlineNav-UnderlineNavItem-syRjR',
    'nav[aria-label="Repository"] li',
    'nav ul li',
    '.UnderlineNav-item',
    '[data-tab-item]'
  ];

  let navItems = [];
  for (const selector of navSelectors) {
    navItems = document.querySelectorAll(selector);
    if (navItems.length > 0) break;
  }

  if (navItems.length === 0) return;

  let issuesTab = null;
  for (const item of navItems) {
    const link = item.querySelector('a');
    if (link && link.href.includes('/issues')) {
      issuesTab = item;
      break;
    }
  }

  if (!issuesTab) return;

  const existingMilestones = Array.from(navItems).find(item => {
    const link = item.querySelector('a');
    return link && link.href.includes('/milestones');
  });

  if (existingMilestones) return;

  const baseUrl = `https://github.com/${pathParts[0]}/${pathParts[1]}`;
  const milestonesUrl = `${baseUrl}/milestones`;

  const milestonesTab = issuesTab.cloneNode(true);

  const link = milestonesTab.querySelector('a');
  if (link) {
    link.href = milestonesUrl;
    link.setAttribute('data-selected-links', 'repo_milestones');

    const svg = link.querySelector('svg');
    if (svg) {
      svg.innerHTML = '<path d="M7.75 0a.75.75 0 0 1 .75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 0 1 0 2.672l-2.07 1.75a1.75 1.75 0 0 1-1.13.414H8.5v5.25a.75.75 0 0 1-1.5 0V10H2.75A1.75 1.75 0 0 1 1 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 0 1 7.75 0Zm4.384 8.5a.25.25 0 0 0 .161-.06l2.07-1.75a.248.248 0 0 0 0-.38l-2.07-1.75a.25.25 0 0 0-.161-.06H2.75a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h9.384Z"></path>';
      svg.setAttribute('class', 'octicon octicon-milestone');
    }

    const textSpans = link.querySelectorAll('span');
    for (const span of textSpans) {
      if (span.textContent.trim() === 'Issues' || span.textContent.includes('Issues')) {
        span.textContent = 'Milestones';
      }
    }
  }

  issuesTab.parentNode.insertBefore(milestonesTab, issuesTab.nextSibling);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addMilestonesTab);
} else {
  addMilestonesTab();
}

let timeoutId = null;
const observer = new MutationObserver(() => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(addMilestonesTab, 100);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

document.addEventListener('pjax:end', () => {
  setTimeout(addMilestonesTab, 100);
});

document.addEventListener('turbo:render', () => {
  setTimeout(addMilestonesTab, 100);
});
