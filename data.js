// ============================================
// 2026 FIFA World Cup 数据
// ============================================

const WORLD_CUP_DATA = {
    // 球场数据
    venues: [
        { name: "Estadio Azteca", city: "墨西哥城", country: "🇲🇽 墨西哥", capacity: 80824, emoji: "🏟️" },
        { name: "MetLife Stadium", city: "纽约/新泽西", country: "🇺🇸 美国", capacity: 80663, emoji: "🏟️" },
        { name: "AT&T Stadium", city: "达拉斯", country: "🇺🇸 美国", capacity: 70649, emoji: "🏟️" },
        { name: "SoFi Stadium", city: "洛杉矶", country: "🇺🇸 美国", capacity: 70492, emoji: "🏟️" },
        { name: "Arrowhead Stadium", city: "堪萨斯城", country: "🇺🇸 美国", capacity: 69045, emoji: "🏟️" },
        { name: "Levi's Stadium", city: "旧金山湾区", country: "🇺🇸 美国", capacity: 68827, emoji: "🏟️" },
        { name: "NRG Stadium", city: "休斯顿", country: "🇺🇸 美国", capacity: 68777, emoji: "🏟️" },
        { name: "Lincoln Financial Field", city: "费城", country: "🇺🇸 美国", capacity: 68324, emoji: "🏟️" },
        { name: "Mercedes-Benz Stadium", city: "亚特兰大", country: "🇺🇸 美国", capacity: 68239, emoji: "🏟️" },
        { name: "Lumen Field", city: "西雅图", country: "🇺🇸 美国", capacity: 66925, emoji: "🏟️" },
        { name: "Hard Rock Stadium", city: "迈阿密", country: "🇺🇸 美国", capacity: 64478, emoji: "🏟️" },
        { name: "Gillette Stadium", city: "波士顿", country: "🇺🇸 美国", capacity: 64146, emoji: "🏟️" },
        { name: "BC Place", city: "温哥华", country: "🇨🇦 加拿大", capacity: 52497, emoji: "🏟️" },
        { name: "Estadio BBVA", city: "蒙特雷", country: "🇲🇽 墨西哥", capacity: 51243, emoji: "🏟️" },
        { name: "Estadio Akron", city: "瓜达拉哈拉", country: "🇲🇽 墨西哥", capacity: 45664, emoji: "🏟️" },
        { name: "BMO Field", city: "多伦多", country: "🇨🇦 加拿大", capacity: 43036, emoji: "🏟️" }
    ],

    // 小组赛程数据
    groups: {
        A: {
            teams: [
                { name: "墨西哥", flag: "🇲🇽", code: "MEX", p: 1, w: 1, d: 0, l: 0, gf: 1, ga: 0, pts: 3 },
                { name: "加拿大", flag: "🇨🇦", code: "CAN", p: 1, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "南非", flag: "🇿🇦", code: "RSA", p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 1, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        B: {
            teams: [
                { name: "阿根廷", flag: "🇦🇷", code: "ARG", p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
                { name: "摩洛哥", flag: "🇲🇦", code: "MAR", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "秘鲁", flag: "🇵🇪", code: "PER", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        C: {
            teams: [
                { name: "美国", flag: "🇺🇸", code: "USA", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
                { name: "澳大利亚", flag: "🇦🇺", code: "AUS", p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
                { name: "土耳其", flag: "🇹🇷", code: "TUR", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        D: {
            teams: [
                { name: "德国", flag: "🇩🇪", code: "GER", p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, pts: 3 },
                { name: "库拉索", flag: "🇨🇼", code: "CUW", p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, pts: 0 },
                { name: "波兰", flag: "🇵🇱", code: "POL", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        E: {
            teams: [
                { name: "西班牙", flag: "🇪🇸", code: "ESP", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "巴西", flag: "🇧🇷", code: "BRA", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        F: {
            teams: [
                { name: "法国", flag: "🇫🇷", code: "FRA", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "比利时", flag: "🇧🇪", code: "BEL", p: 1, w: 0, d: 1, l: 0, gf: 0, ga: 0, pts: 1 },
                { name: "埃及", flag: "🇪🇬", code: "EGY", p: 1, w: 0, d: 1, l: 0, gf: 0, ga: 0, pts: 1 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        G: {
            teams: [
                { name: "英格兰", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        H: {
            teams: [
                { name: "荷兰", flag: "🇳🇱", code: "NED", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        I: {
            teams: [
                { name: "日本", flag: "🇯🇵", code: "JPN", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "韩国", flag: "🇰🇷", code: "KOR", p: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, pts: 1 },
                { name: "捷克", flag: "🇨🇿", code: "CZE", p: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, pts: 1 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        J: {
            teams: [
                { name: "葡萄牙", flag: "🇵🇹", code: "POR", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        K: {
            teams: [
                { name: "意大利", flag: "🇮🇹", code: "ITA", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        },
        L: {
            teams: [
                { name: "乌拉圭", flag: "🇺🇾", code: "URU", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
                { name: "待定", flag: "🌍", code: "TBD", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            ]
        }
    },

    // 比赛数据 (已完赛 + 即将开赛)
    matches: [
        // 已完赛
        { id: 1, date: "2026-06-11", time: "20:00", home: "墨西哥", homeFlag: "🇲🇽", away: "南非", awayFlag: "🇿🇦", homeScore: 1, awayScore: 0, status: "finished", stage: "group", group: "A", venue: "Estadio Azteca", city: "墨西哥城" },
        { id: 2, date: "2026-06-12", time: "02:00", home: "阿根廷", homeFlag: "🇦🇷", away: "秘鲁", awayFlag: "🇵🇪", homeScore: 2, awayScore: 0, status: "finished", stage: "group", group: "B", venue: "Estadio BBVA", city: "蒙特雷" },
        { id: 3, date: "2026-06-12", time: "05:00", home: "美国", homeFlag: "🇺🇸", away: "澳大利亚", awayFlag: "🇦🇺", homeScore: 1, awayScore: 1, status: "finished", stage: "group", group: "C", venue: "SoFi Stadium", city: "洛杉矶" },
        { id: 4, date: "2026-06-12", time: "02:00", home: "德国", homeFlag: "🇩🇪", away: "库拉索", awayFlag: "🇨🇼", homeScore: 3, awayScore: 1, status: "finished", stage: "group", group: "D", venue: "Lincoln Financial Field", city: "费城" },
        { id: 5, date: "2026-06-13", time: "02:00", home: "比利时", homeFlag: "🇧🇪", away: "埃及", awayFlag: "🇪🇬", homeScore: 0, awayScore: 0, status: "finished", stage: "group", group: "F", venue: "Lumen Field", city: "西雅图" },
        { id: 6, date: "2026-06-13", time: "08:30", home: "韩国", homeFlag: "🇰🇷", away: "捷克", awayFlag: "🇨🇿", homeScore: 2, awayScore: 2, status: "finished", stage: "group", group: "I", venue: "BC Place", city: "温哥华" },
        { id: 7, date: "2026-06-13", time: "08:30", home: "澳大利亚", homeFlag: "🇦🇺", away: "土耳其", awayFlag: "🇹🇷", homeScore: 1, awayScore: 0, status: "finished", stage: "group", group: "C", venue: "BC Place", city: "温哥华" },
        // ... 更多已完赛比赛省略，实际数据会更完整

        // 即将开赛 (示例)
        { id: 30, date: "2026-06-20", time: "02:00", home: "阿根廷", homeFlag: "🇦🇷", away: "摩洛哥", awayFlag: "🇲🇦", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "B", venue: "MetLife Stadium", city: "纽约" },
        { id: 31, date: "2026-06-20", time: "05:00", home: "墨西哥", homeFlag: "🇲🇽", away: "加拿大", awayFlag: "🇨🇦", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "A", venue: "SoFi Stadium", city: "洛杉矶" },
        { id: 32, date: "2026-06-20", time: "08:00", home: "西班牙", homeFlag: "🇪🇸", away: "巴西", awayFlag: "🇧🇷", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "E", venue: "AT&T Stadium", city: "达拉斯" },
        { id: 33, date: "2026-06-20", time: "23:00", home: "法国", homeFlag: "🇫🇷", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "F", venue: "Mercedes-Benz Stadium", city: "亚特兰大" },
        { id: 34, date: "2026-06-21", time: "02:00", home: "英格兰", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "G", venue: "NRG Stadium", city: "休斯顿" },
        { id: 35, date: "2026-06-21", time: "05:00", home: "日本", homeFlag: "🇯🇵", away: "韩国", awayFlag: "🇰🇷", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "I", venue: "Gillette Stadium", city: "波士顿" },
        { id: 36, date: "2026-06-21", time: "08:00", home: "葡萄牙", homeFlag: "🇵🇹", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "J", venue: "Hard Rock Stadium", city: "迈阿密" },
        { id: 37, date: "2026-06-21", time: "23:00", home: "荷兰", homeFlag: "🇳🇱", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "H", venue: "Arrowhead Stadium", city: "堪萨斯城" },
        { id: 38, date: "2026-06-22", time: "02:00", home: "意大利", homeFlag: "🇮🇹", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "K", venue: "Levi's Stadium", city: "旧金山" },
        { id: 39, date: "2026-06-22", time: "05:00", home: "乌拉圭", homeFlag: "🇺🇾", away: "待定", awayFlag: "🌍", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "L", venue: "Estadio Akron", city: "瓜达拉哈拉" },
        { id: 40, date: "2026-06-22", time: "08:00", home: "美国", homeFlag: "🇺🇸", away: "土耳其", awayFlag: "🇹🇷", homeScore: null, awayScore: null, status: "upcoming", stage: "group", group: "C", venue: "BMO Field", city: "多伦多" },
    ],

    // 淘汰赛阶段
    knockoutStages: [
        { stage: "r16", name: "1/16决赛", dateRange: "6月28日 - 7月2日" },
        { stage: "r32", name: "1/8决赛", dateRange: "7月4日 - 7月7日" },
        { stage: "qf", name: "1/4决赛", dateRange: "7月10日 - 7月11日" },
        { stage: "sf", name: "半决赛", dateRange: "7月14日 - 7月15日" },
        { stage: "final", name: "决赛", dateRange: "7月19日" }
    ]
};
