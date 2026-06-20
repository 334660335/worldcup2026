// ============================================
// 2026 FIFA World Cup - 应用逻辑
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    updateTimestamps();
    renderTodayMatches();
    renderSchedule();
    renderGroupTables();
    renderVenues();
    initFilters();
    initTabs();
    initScrollAnimations();
    animateStats();
}

// ---- 时间更新 ----
function updateTimestamps() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const timeStr = now.toLocaleDateString('zh-CN', options);

    const updateTime = document.getElementById('updateTime');
    const footerTime = document.getElementById('footerTime');
    const todayDate = document.getElementById('todayDate');

    if (updateTime) updateTime.textContent = timeStr;
    if (footerTime) footerTime.textContent = timeStr;
    if (todayDate) todayDate.textContent = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
}

// ---- 今日比赛 ----
function renderTodayMatches() {
    const container = document.getElementById('todayMatches');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const todayMatches = WORLD_CUP_DATA.matches.filter(m => m.date === today);

    if (todayMatches.length === 0) {
        // 显示即将开赛的比赛
        const upcoming = WORLD_CUP_DATA.matches
            .filter(m => m.status === 'upcoming')
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
            .slice(0, 4);

        if (upcoming.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;">暂无即将开赛的比赛</p>';
            return;
        }

        container.innerHTML = upcoming.map(m => createMatchCard(m)).join('');
    } else {
        container.innerHTML = todayMatches.map(m => createMatchCard(m)).join('');
    }
}

function createMatchCard(match) {
    const isLive = match.status === 'live';
    const isFinished = match.status === 'finished';
    const scoreDisplay = isFinished
        ? `${match.homeScore} <span class="score-sep">-</span> ${match.awayScore}`
        : isLive
        ? `${match.homeScore || 0} <span class="score-sep">-</span> ${match.awayScore || 0}`
        : 'VS';

    const statusText = isFinished ? '完赛' : isLive ? '进行中' : '未开始';
    const dateObj = new Date(match.date + 'T' + match.time);
    const timeStr = dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

    return `
        <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-card-header">
                <span class="match-time">${dateStr} ${timeStr}</span>
                ${isLive ? '<span class="live-tag">LIVE</span>' : `<span>${match.group ? match.group + '组' : match.stage}</span>`}
            </div>
            <div class="match-teams">
                <div class="match-team home">
                    <span class="team-flag">${match.homeFlag}</span>
                    <div class="team-info">
                        <div class="team-name">${match.home}</div>
                    </div>
                </div>
                <div class="match-score">${scoreDisplay}</div>
                <div class="match-team away">
                    <span class="team-flag">${match.awayFlag}</span>
                    <div class="team-info">
                        <div class="team-name">${match.away}</div>
                    </div>
                </div>
            </div>
            <div class="match-card-footer">
                <span>${statusText}</span>
                <span>📍 ${match.city}</span>
            </div>
        </div>
    `;
}

// ---- 赛程列表 ----
function renderSchedule(filter = 'all', tab = 'upcoming') {
    const container = document.getElementById('scheduleList');
    if (!container) return;

    let matches = WORLD_CUP_DATA.matches;

    // 按阶段过滤
    if (filter !== 'all') {
        matches = matches.filter(m => m.stage === filter);
    }

    // 按标签过滤
    if (tab === 'upcoming') {
        matches = matches.filter(m => m.status === 'upcoming');
    } else {
        matches = matches.filter(m => m.status === 'finished');
    }

    // 按日期排序
    matches.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    if (matches.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;">暂无匹配的比赛</p>';
        return;
    }

    container.innerHTML = matches.map(m => {
        const dateObj = new Date(m.date + 'T' + m.time);
        const dateStr = dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        const weekday = dateObj.toLocaleDateString('zh-CN', { weekday: 'short' });
        const timeStr = dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const isFinished = m.status === 'finished';
        const score = isFinished ? `${m.homeScore} - ${m.awayScore}` : timeStr;

        return `
            <div class="schedule-item">
                <div class="schedule-date">
                    <div class="date-day">${dateStr}</div>
                    <div>${weekday}</div>
                </div>
                <div class="schedule-team home">
                    <span>${m.homeFlag}</span>
                    <span>${m.home}</span>
                </div>
                <div class="schedule-score">${score}</div>
                <div class="schedule-team away">
                    <span>${m.awayFlag}</span>
                    <span>${m.away}</span>
                </div>
                <div class="schedule-venue">
                    📍 ${m.city}<br>
                    <small>${m.venue}</small>
                </div>
            </div>
        `;
    }).join('');
}

// ---- 小组积分 ----
function renderGroupTables() {
    const container = document.getElementById('groupTables');
    const selector = document.querySelector('.group-selector');
    if (!container || !selector) return;

    // 创建小组选择器
    const groups = Object.keys(WORLD_CUP_DATA.groups);
    selector.innerHTML = groups.map(g =>
        `<button class="group-btn active" data-group="${g}">${g}</button>`
    ).join('');

    // 渲染所有小组
    container.innerHTML = groups.map(g => createGroupTable(g)).join('');

    // 小组按钮点击事件
    selector.addEventListener('click', (e) => {
        if (e.target.classList.contains('group-btn')) {
            const group = e.target.dataset.group;
            const card = document.getElementById(`group-${group}`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.borderColor = 'var(--accent)';
                setTimeout(() => card.style.borderColor = '', 2000);
            }
        }
    });
}

function createGroupTable(groupKey) {
    const group = WORLD_CUP_DATA.groups[groupKey];
    // 按积分排序
    const sortedTeams = [...group.teams].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gf - b.ga !== a.gf - a.ga) return (b.gf - b.ga) - (a.gf - a.ga);
        return b.gf - a.gf;
    });

    const rows = sortedTeams.map((t, i) => {
        const posClass = i < 2 ? 'pos-advance' : i === 2 ? 'pos-playoff' : 'pos-out';
        return `
            <tr>
                <td><span class="pos ${posClass}">${i + 1}</span></td>
                <td>
                    <div class="team-cell">
                        <span>${t.flag}</span>
                        <span>${t.name}</span>
                    </div>
                </td>
                <td>${t.p}</td>
                <td>${t.w}</td>
                <td>${t.d}</td>
                <td>${t.l}</td>
                <td>${t.gf}:${t.ga}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>
        `;
    }).join('');

    return `
        <div class="group-table-card" id="group-${groupKey}">
            <div class="group-table-header">
                ⚽ 小组 ${groupKey}
                <span style="margin-left:auto;font-size:0.8rem;opacity:0.7;">前2名晋级</span>
            </div>
            <table class="group-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>球队</th>
                        <th>场</th>
                        <th>胜</th>
                        <th>平</th>
                        <th>负</th>
                        <th>进球</th>
                        <th>积分</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// ---- 球场 ----
function renderVenues() {
    const container = document.getElementById('venuesGrid');
    if (!container) return;

    container.innerHTML = WORLD_CUP_DATA.venues.map(v => `
        <div class="venue-card">
            <div class="venue-img">${v.emoji}</div>
            <div class="venue-info">
                <div class="venue-name">${v.name}</div>
                <div class="venue-city">📍 ${v.city}</div>
                <span class="venue-capacity">👥 ${v.capacity.toLocaleString()} 座</span>
                <div class="venue-country">${v.country}</div>
            </div>
        </div>
    `).join('');
}

// ---- 过滤器 ----
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;

            const activeTab = document.querySelector('.tab-btn.active');
            const tab = activeTab ? activeTab.dataset.tab : 'upcoming';
            renderSchedule(currentFilter, tab);
        });
    });
}

// ---- 标签切换 ----
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const activeFilter = document.querySelector('.filter-btn.active');
            const filter = activeFilter ? activeFilter.dataset.filter : 'all';
            renderSchedule(filter, btn.dataset.tab);
        });
    });
}

// ---- 滚动动画 ----
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.match-card, .analysis-card, .stat-card, .venue-card, .group-table-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // 导航高亮
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ---- 数字动画 ----
function animateStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateNumber(el, 0, target, 1500);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(start + (end - start) * eased);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
