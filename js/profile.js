/**
 * Project Thai: Profile & Verified Competencies Module (CV 3.0)
 * Renders engineer background, verified skills radar matrix (4 axes SVG),
 * core engineering principles, and printable recruiter-friendly CV.
 */

(function(root) {
    'use strict';

    function renderProfileView() {
        const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null);
        if (!data || !data.engineerProfile) return;

        const eng = data.engineerProfile;

        // 1. Hero Identity & Bio
        const nameEl = document.getElementById("hero-name-display");
        if (nameEl) nameEl.innerText = eng.name;

        const roleEl = document.getElementById("hero-role-display");
        if (roleEl) roleEl.innerText = eng.title;

        const bioEl = document.getElementById("hero-bio-display");
        if (bioEl) bioEl.innerText = eng.bio;

        const statusEl = document.getElementById("hero-badge-status");
        if (statusEl) {
            const statusText = eng.status || eng.statusBadge || 'Open for Engineering Challenges';
            statusEl.innerHTML = `<span class="status-pulse-dot" style="background: #00ff88;"></span> ${statusText}`;
        }

        const avatarEl = document.getElementById("profile-avatar-icon");
        if (avatarEl) avatarEl.innerText = eng.avatar || "🤖";

        // 2. Connect Links
        const connectEl = document.getElementById("profile-connect-links");
        if (connectEl) {
            const githubUrl = (eng.connect && eng.connect.github) || eng.github || "https://github.com/v2tAcodin";
            const linkedinUrl = (eng.connect && eng.connect.linkedin) || eng.linkedin || "https://linkedin.com";
            const emailAddr = (eng.connect && eng.connect.email) || eng.email || "v2t.embedded@gmail.com";
            connectEl.innerHTML = `
                <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="connect-chip">
                    <span>🐙</span> GitHub
                </a>
                <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="connect-chip">
                    <span>💼</span> LinkedIn
                </a>
                <a href="mailto:${emailAddr}?subject=Trao%20đổi%20cơ%20hội%20kỹ%20sư%20Edge%20AI" class="connect-chip">
                    <span>✉️</span> ${emailAddr}
                </a>
            `;
        }

        // 3. Core Principles
        const principlesEl = document.getElementById("profile-principles-container");
        if (principlesEl && Array.isArray(eng.principles)) {
            principlesEl.innerHTML = eng.principles.map(p => `
                <div class="principle-card">
                    <div class="principle-icon">⚡</div>
                    <div class="principle-title">${p.title}</div>
                    <div class="principle-desc">${p.desc}</div>
                </div>
            `).join('');
        }

        // 4. Skills Radar Matrix (4 Axes SVG)
        const radarData = eng.skillsRadar || eng.radarMatrix || [];
        renderSkillsRadarMatrix(radarData);

        // 5. Production Projects Showcase Summary
        const projSummaryEl = document.getElementById("profile-projects-summary");
        if (projSummaryEl && Array.isArray(data.projects)) {
            projSummaryEl.innerHTML = data.projects.map(p => `
                <div class="profile-proj-card" onclick="if(window.PortfolioController) PortfolioController.selectProject('${p.id}')">
                    <div class="pp-header">
                        <span class="pp-title">${p.title}</span>
                        <span class="pp-badge">${p.status}</span>
                    </div>
                    <div class="pp-summary">${p.summary}</div>
                    <div class="pp-metric">FPS: ${p.benchmarks ? (p.benchmarks.fps || 'Real-Time') : 'N/A'} • Latency: ${p.benchmarks ? p.benchmarks.latency : 'N/A'}</div>
                </div>
            `).join('');
        }

        // 6. Auto-generated Printable CV Text
        const cvTextEl = document.getElementById("auto-cv-text");
        if (cvTextEl) {
            const radarText = (eng.radarMatrix || []).map(r => `  • ${r.pillar} (${r.score}%): ${r.description}`).join('\n');
            const projectsText = (data.projects || []).map(p => `  • [${p.status.toUpperCase()}] ${p.title}: ${p.summary}`).join('\n');

            cvTextEl.innerText = 
`# CURRICULUM VITAE // EMBEDDED SYSTEMS & EDGE AI ENGINEER
- Họ và tên: ${eng.name}
- Chức danh: ${eng.title}
- Trạng thái: ${eng.statusBadge}
- Email: ${eng.connect ? eng.connect.email : 'v2t.embedded@gmail.com'}
- GitHub: ${eng.connect ? eng.connect.github : 'https://github.com/v2tAcodin'}

## 1. TỔNG QUAN NĂNG LỰC CỐT LÕI (CORE COMPETENCIES)
${eng.bio}

## 2. MA TRẬN KỸ NĂNG CHUYÊN SÂU (RADAR MATRIX):
${radarText}

## 3. DỰ ÁN THỰC CHIẾN TIÊU BIỂU (PRODUCTION SHOWCASE):
${projectsText}

## 4. NGUYÊN TẮC THIẾT KẾ HỆ THỐNG:
  • Zero Waste Memory: Tối ưu từng byte SRAM và Flash, nói không với cấp phát động.
  • Real-Time Determinism: Đảm bảo độ trễ phản hồi xác định, ngắt cứng chính xác.
  • Air-Gapped Intelligence: Mô hình AI suy luận độc lập tại biên, an toàn bảo mật.`;
        }
    }

    /**
     * Renders a sleek 4-axis SVG Radar Matrix
     */
    function renderSkillsRadarMatrix(radarData) {
        const container = document.getElementById("skills-radar-container");
        if (!container) return;

        if (!Array.isArray(radarData) || radarData.length === 0) {
            container.innerHTML = '<div style="color: #64748b; text-align: center; padding: 20px;">Đang tải dữ liệu radar...</div>';
            return;
        }

        const size = 380;
        const cx = size / 2;
        const cy = size / 2;
        const R = 125;

        // 4 Axes: Top (-PI/2), Right (0), Bottom (PI/2), Left (PI)
        const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

        // Background concentric webs (25%, 50%, 75%, 100%)
        const webLevels = [0.25, 0.5, 0.75, 1.0];
        const webPolygons = webLevels.map(lvl => {
            const pts = angles.map(a => {
                const x = cx + R * lvl * Math.cos(a);
                const y = cy + R * lvl * Math.sin(a);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            return `<polygon points="${pts}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />`;
        }).join('');

        // 4 Axis radial lines
        const axisLines = angles.map(a => {
            const x = cx + R * Math.cos(a);
            const y = cy + R * Math.sin(a);
            return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.2" stroke-dasharray="3,3" />`;
        }).join('');

        // Data polygon points
        const dataPoints = radarData.map((item, idx) => {
            const score = Math.max(10, Math.min(100, item.score || 80));
            const angle = angles[idx % angles.length];
            const r = R * (score / 100);
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return { x, y, score, item };
        });

        const polygonPointsStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

        // Glowing vertex dots
        const vertexDots = dataPoints.map(p => 
            `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#00ff88" stroke="#ffffff" stroke-width="1.5" />`
        ).join('');

        // Perimeter Labels
        const labelsSvg = [
            // Top: Embedded Core
            `<text x="${cx}" y="${cy - R - 14}" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700">Embedded Core (${radarData[0] ? radarData[0].score : 95}%)</text>`,
            // Right: Edge AI
            `<text x="${cx + R + 10}" y="${cy + 4}" text-anchor="start" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700">Edge AI & TinyML (${radarData[1] ? radarData[1].score : 90}%)</text>`,
            // Bottom: Hardware Protocols
            `<text x="${cx}" y="${cy + R + 22}" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700">Hardware Protocols (${radarData[2] ? radarData[2].score : 88}%)</text>`,
            // Left: System Optimization
            `<text x="${cx - R - 10}" y="${cy + 4}" text-anchor="end" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700">Optimization (${radarData[3] ? radarData[3].score : 92}%)</text>`
        ].join('');

        // Detailed pillar cards underneath
        const pillarCards = radarData.map(r => `
            <div class="radar-pillar-card">
                <div class="rpc-header">
                    <span class="rpc-name">${r.pillar}</span>
                    <span class="rpc-score">${r.score}%</span>
                </div>
                <div class="rpc-bar">
                    <div class="rpc-fill" style="width: ${r.score}%;"></div>
                </div>
                <div class="rpc-desc">${r.description}</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="radar-wrapper">
                <div class="radar-svg-box">
                    <svg viewBox="0 0 ${size} ${size}" class="skills-radar-svg">
                        <defs>
                            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.4" />
                                <stop offset="100%" stop-color="#0072ff" stop-opacity="0.1" />
                            </radialGradient>
                        </defs>
                        ${webPolygons}
                        ${axisLines}
                        <polygon points="${polygonPointsStr}" fill="url(#radarGlow)" stroke="#00f0ff" stroke-width="2.5" />
                        ${vertexDots}
                        ${labelsSvg}
                    </svg>
                </div>
                <div class="radar-pillars-grid">
                    ${pillarCards}
                </div>
            </div>
        `;
    }

    function copyAutoIntroduction() {
        const cvTextEl = document.getElementById("auto-cv-text");
        if (!cvTextEl) return;
        const text = cvTextEl.innerText;
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (typeof root.showToast === 'function') {
                    root.showToast("📋 Đã sao chép đoạn CV Kỹ Sư vào Clipboard!");
                }
            }).catch(() => {});
        }
    }

    function copyPortfolioLink() {
        if (typeof window === 'undefined') return;
        const url = window.location.origin + window.location.pathname + "#profile";
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                if (typeof root.showToast === 'function') {
                    root.showToast("🔗 Đã sao chép link Portfolio Online!");
                }
            }).catch(() => {});
        }
    }

    // Export module
    root.renderProfileView = renderProfileView;
    root.renderSkillsRadarMatrix = renderSkillsRadarMatrix;
    root.copyAutoIntroduction = copyAutoIntroduction;
    root.copyPortfolioLink = copyPortfolioLink;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            renderProfileView,
            renderSkillsRadarMatrix,
            copyAutoIntroduction,
            copyPortfolioLink
        };
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
