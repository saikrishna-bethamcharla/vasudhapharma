/**
 * Vasudha Pharma — Milestones & Corporate Journey Roadmap
 * Dynamic Thematic Filtering & Layout Synchronization
 */

(function () {
  'use strict';

  function initMilestonesRoadmap() {
    const wrap = document.getElementById('milestonesRoadmapWrap');
    if (!wrap) return;

    const filterBtns = document.querySelectorAll('.mr-filter-btn');
    const items = Array.from(wrap.querySelectorAll('.mr-item'));

    function recomputeAlternation() {
      // If mobile width (<768px), CSS stacks all items on the right of the spine
      if (window.innerWidth <= 768) return;

      let visibleCount = 0;
      items.forEach(item => {
        if (!item.classList.contains('is-hidden')) {
          item.classList.remove('left', 'right');
          if (visibleCount % 2 === 0) {
            item.classList.add('left');
          } else {
            item.classList.add('right');
          }
          visibleCount++;
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter') || 'all';

        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        items.forEach(item => {
          const cats = (item.getAttribute('data-category') || '').split(' ');
          if (filter === 'all' || cats.includes(filter)) {
            item.classList.remove('is-hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 30);
          } else {
            item.classList.add('is-hidden');
          }
        });

        recomputeAlternation();
      });
    });

    window.addEventListener('resize', recomputeAlternation);

    // Initial check
    recomputeAlternation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMilestonesRoadmap);
  } else {
    initMilestonesRoadmap();
  }
})();
