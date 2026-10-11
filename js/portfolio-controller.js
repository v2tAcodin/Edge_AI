/**
 * Project Thai: Portfolio Controller (Central Seam)
 * Orchestrates navigation views, project data queries, and Deep-Dive HUD modal lifecycle.
 */

(function(root) {
    'use strict';

    class PortfolioControllerClass {
        constructor() {
            this.data = null;
            this.activeView = 'tree3d';
            this.selectedProjectId = null;
            this.activeCategoryFilter = 'all';
            this.initialized = false;
        }

        init(portfolioData) {
            this.data = portfolioData || (root.PortfolioData || null);
            this.activeView = 'tree3d';
            this.initialized = true;

            // Bind global DOM listeners if in browser environment
            if (typeof document !== 'undefined') {
                this.syncDOMView(this.activeView);
            }
            return this;
        }

        getActiveView() {
            return this.activeView;
        }

        switchView(viewName) {
            const validViews = ['tree3d', 'grid', 'profile'];
            if (!validViews.includes(viewName)) {
                console.warn(`[PortfolioController] Unknown view: ${viewName}, defaulting to tree3d`);
                viewName = 'tree3d';
            }

            this.activeView = viewName;

            if (typeof document !== 'undefined') {
                this.syncDOMView(viewName);
            }

            // Dispatch global event for listeners (like 3D canvas resize or grid re-render)
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:view-changed', {
                        detail: { view: viewName }
                    }));
                } catch (e) {
                    // Fallback for non-browser environments
                }
            }
            return this.activeView;
        }

        syncDOMView(viewName) {
            const viewMap = {
                'tree3d': 'view-tree3d',
                'grid': 'view-grid',
                'profile': 'view-profile'
            };

            const tabMap = {
                'tree3d': 'tab-tree3d',
                'grid': 'tab-grid',
                'profile': 'tab-profile'
            };

            // Toggle views visibility
            Object.keys(viewMap).forEach(key => {
                const el = document.getElementById(viewMap[key]);
                if (el && el.style) {
                    el.style.display = (key === viewName) ? 'block' : 'none';
                }
            });

            // Toggle active tab buttons
            Object.keys(tabMap).forEach(key => {
                const tabBtn = document.getElementById(tabMap[key]);
                if (tabBtn && tabBtn.classList) {
                    if (key === viewName) {
                        tabBtn.classList.add('active');
                    } else {
                        tabBtn.classList.remove('active');
                    }
                }
            });
        }

        getProjects(category = 'all') {
            if (!this.data || !Array.isArray(this.data.projects)) {
                return [];
            }
            if (!category || category === 'all') {
                return this.data.projects;
            }
            return this.data.projects.filter(p => p.category === category);
        }

        getProjectById(projectId) {
            if (!this.data || !Array.isArray(this.data.projects)) {
                return null;
            }
            return this.data.projects.find(p => p.id === projectId) || null;
        }

        getProfile() {
            return this.data ? this.data.engineerProfile : null;
        }

        selectProject(projectId) {
            const project = this.getProjectById(projectId);
            if (!project) {
                console.warn(`[PortfolioController] Project ${projectId} not found`);
                return null;
            }

            this.selectedProjectId = projectId;

            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:project-selected', {
                        detail: { project: project }
                    }));
                } catch (e) {
                    // Fallback
                }
            }
            return project;
        }

        filterCategory(category) {
            this.activeCategoryFilter = category || 'all';
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:filter-changed', {
                        detail: { category: this.activeCategoryFilter }
                    }));
                } catch (e) {
                    // Fallback
                }
            }
            return this.getProjects(this.activeCategoryFilter);
        }
    }

    const PortfolioController = new PortfolioControllerClass();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioController;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioController = PortfolioController;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
