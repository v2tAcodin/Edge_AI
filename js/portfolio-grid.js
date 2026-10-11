/**
 * Project Thai: Portfolio Grid & Category Filtering Module
 * Renders high-tech responsive project cards with status badges, benchmark metrics,
 * and category filtering synchronized with PortfolioController.
 */

(function(root) {
    'use strict';

    class PortfolioGridClass {
        constructor() {
            this.container = null;
            this.currentCategory = 'all';
            this.initialized = false;
        }

        init() {
            if (typeof document === 'undefined') return;
            this.container = document.getElementById("projects-grid-container");
            this.initialized = true;

            // Listen to global filter changes from PortfolioController
            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                window.addEventListener('portfolio:filter-changed', (e) => {
                    if (e && e.detail && e.detail.category) {
                        this.filterCategory(e.detail.category, false);
                    }
                });
            }
        }

        render() {
            if (!this.container) {
                if (typeof document !== 'undefined') {
                    this.container = document.getElementById("projects-grid-container");
                }
            }
            if (!this.container) return;

            const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null);
            
            let projects = [];
            if (controller && typeof controller.getProjects === 'function') {
                projects = controller.getProjects(this.currentCategory);
            } else if (data && Array.isArray(data.projects)) {
                projects = (this.currentCategory === 'all') 
                    ? data.projects 
                    : data.projects.filter(p => p.category === this.currentCategory);
            }

            if (projects.length === 0) {
                this.container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #94a3b8;">
                        <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
                        <div style="font-size: 16px; font-weight: 600; color: #f8fafc;">Không tìm thấy dự án trong danh mục này</div>
                        <div style="font-size: 13px; margin-top: 6px;">Vui lòng chọn danh mục khác trên thanh lọc.</div>
                    </div>
                `;
                return;
            }

            this.container.innerHTML = projects.map(p => this.renderProjectCard(p)).join('');
        }

        renderProjectCard(p) {
            // Centralized Category Metadata & Status Badge Styling
            const categoryMeta = (root.PortfolioData && typeof root.PortfolioData.getCategoryMeta === 'function')
                ? root.PortfolioData.getCategoryMeta(p.category)
                : (root.PortfolioData && root.PortfolioData.categoryMeta && root.PortfolioData.categoryMeta[p.category])
                || { icon: '⚡', label: p.category };

            const statusStyle = (root.PortfolioData && typeof root.PortfolioData.getStatusStyle === 'function')
                ? root.PortfolioData.getStatusStyle(p.status)
                : (root.PortfolioData && root.PortfolioData.statusStyle && root.PortfolioData.statusStyle[p.status])
                || { bg: 'rgba(0, 240, 255, 0.12)', border: '#00f0ff', text: '#00f0ff', dot: '#00f0ff' };

            // Benchmarks Summary Pills
            const b = p.benchmarks || {};
            const metricsPills = Object.keys(b).slice(0, 3).map(k => {
                const label = k.replace(/([A-Z])/g, ' $1').toUpperCase();
                return `<span class="grid-metric-pill"><strong>${label}:</strong> ${b[k]}</span>`;
            }).join('');

            // Tech Stack Tags
            const tagPills = (p.tags || []).map(t => 
                `<span class="grid-tag-pill">${t}</span>`
            ).join('');

            return `
                <div class="project-showcase-card" id="card-${p.id}" onclick="PortfolioGrid.onCardClick('${p.id}')">
                    <div class="card-header-bar">
                        <div class="card-cat-badge">
                            <span>${categoryMeta.icon}</span>
                            <span>${categoryMeta.label}</span>
                        </div>
                        <div class="card-status-badge" style="background: ${statusStyle.bg}; border: 1px solid ${statusStyle.border}; color: ${statusStyle.text};">
                            <span class="status-pulse-dot" style="background: ${statusStyle.dot};"></span>
                            <span>${p.status}</span>
                        </div>
                    </div>

                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-summary">${p.summary}</p>

                    <div class="card-tags-row">
                        ${tagPills}
                    </div>

                    <div class="card-metrics-grid">
                        ${metricsPills}
                    </div>

                    <div class="card-action-bar">
                        <button type="button" class="btn-card-inspect">
                            <span>⚡ Khám Phá Kiến Trúc &amp; Telemetry</span>
                            <span class="arrow-glyph">→</span>
                        </button>
                    </div>
                </div>
            `;
        }

        onCardClick(projectId) {
            const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
            if (controller && typeof controller.selectProject === 'function') {
                controller.selectProject(projectId);
            }
        }

        filterCategory(category, notifyController = true) {
            this.currentCategory = category || 'all';
            this.render();

            // Update active pill button in UI
            if (typeof document !== 'undefined') {
                document.querySelectorAll('.galaxy-filter-pill, .grid-filter-pill').forEach(btn => {
                    const cat = btn.getAttribute('data-track') || btn.getAttribute('data-cat');
                    if (cat === this.currentCategory) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            if (notifyController) {
                const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
                if (controller && typeof controller.filterCategory === 'function') {
                    controller.filterCategory(this.currentCategory);
                }
            }
        }
    }

    const PortfolioGrid = new PortfolioGridClass();

    // Export module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioGrid;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioGrid = PortfolioGrid;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
