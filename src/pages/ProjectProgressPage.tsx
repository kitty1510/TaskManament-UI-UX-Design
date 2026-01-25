import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MemberData {
    name: string;
    tasks: Task[];
}

interface Task {
    id: string;
    name: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'high' | 'medium' | 'low';
    deadline?: string;
}

interface MemberDataMap {
    [key: string]: MemberData;
}

interface Activity {
    id: string;
    member: string;
    action: string;
    task: string;
    time: string;
}

const ProjectProgressPage = () => {
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showRiskModal, setShowRiskModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [riskResolved, setRiskResolved] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

    const smallChartRef = useRef<HTMLCanvasElement>(null);
    const bigChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const barChartRef = useRef<HTMLCanvasElement>(null);
    const smallChartInstance = useRef<Chart | null>(null);
    const bigChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);
    const barChartInstance = useRef<Chart | null>(null);

    const [memberData, setMemberData] = useState<MemberDataMap>({
        'A': {
            name: 'Thành viên A',
            tasks: [
                { id: 'a1', name: 'Thiết kế Database', status: 'done', priority: 'high' },
                { id: 'a2', name: 'Review Code module User', status: 'in-progress', priority: 'medium' },
                { id: 'a3', name: 'Họp với khách hàng', status: 'done', priority: 'high' },
                { id: 'a4', name: 'Viết Unit Test', status: 'in-progress', priority: 'low' },
                { id: 'a5', name: 'Cập nhật tài liệu', status: 'todo', priority: 'low' }
            ]
        },
        'B': {
            name: 'Thành viên B',
            tasks: [
                { id: 'b1', name: 'Dựng Layout trang chủ', status: 'in-progress', priority: 'high' },
                { id: 'b2', name: 'Fix bug CSS menu', status: 'todo', priority: 'high' },
                { id: 'b3', name: 'Tối ưu hình ảnh', status: 'todo', priority: 'medium' },
                { id: 'b4', name: 'Responsive Mobile', status: 'todo', priority: 'high' },
                { id: 'b5', name: 'Ghép API Login', status: 'todo', priority: 'high' },
                { id: 'b6', name: 'Ghép API Register', status: 'todo', priority: 'high' },
                { id: 'b7', name: 'Fix UI Header', status: 'todo', priority: 'medium' },
                { id: 'b8', name: 'Cập nhật API', status: 'todo', priority: 'medium' },
                { id: 'b9', name: 'Viết báo cáo tuần', status: 'todo', priority: 'low' },
                { id: 'b10', name: 'Check log server', status: 'todo', priority: 'low' }
            ]
        },
        'C': {
            name: 'Thành viên C',
            tasks: [
                { id: 'c1', name: 'Nghiên cứu công nghệ mới', status: 'in-progress', priority: 'medium' }
            ]
        }
    });

    const [activities] = useState<Activity[]>([
        { id: '1', member: 'Thành viên A', action: 'Hoàn thành', task: 'Thiết kế Database', time: '2 giờ trước' },
        { id: '2', member: 'Thành viên B', action: 'Bắt đầu', task: 'Dựng Layout trang chủ', time: '3 giờ trước' },
        { id: '3', member: 'Thành viên A', action: 'Hoàn thành', task: 'Họp với khách hàng', time: '5 giờ trước' },
        { id: '4', member: 'Thành viên C', action: 'Bắt đầu', task: 'Nghiên cứu công nghệ mới', time: '1 ngày trước' },
        { id: '5', member: 'Thành viên A', action: 'Cập nhật', task: 'Review Code module User', time: '1 ngày trước' }
    ]);

    // Helper function to calculate member completion percentage
    const getMemberCompletionRate = (memberId: string) => {
        const tasks = memberData[memberId]?.tasks || [];
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'done').length;
        return Math.round((completed / tasks.length) * 100);
    };

    // Helper function to get progress bar color based on workload
    const getProgressBarColor = (memberId: string) => {
        const taskCount = memberData[memberId]?.tasks.length || 0;
        const completionRate = getMemberCompletionRate(memberId);

        if (memberId === 'B' && !riskResolved && taskCount >= 10) {
            return 'from-red-500 to-red-700';
        }
        if (completionRate >= 70) {
            return 'from-green-400 to-green-600';
        }
        if (completionRate >= 40) {
            return 'from-yellow-400 to-yellow-600';
        }
        return 'from-blue-400 to-blue-600';
    };

    // Calculate statistics
    const getTotalTasks = () => {
        return Object.values(memberData).reduce((sum, member) => sum + member.tasks.length, 0);
    };

    const getCompletedTasks = () => {
        return Object.values(memberData).reduce((sum, member) =>
            sum + member.tasks.filter(t => t.status === 'done').length, 0
        );
    };

    const getInProgressTasks = () => {
        return Object.values(memberData).reduce((sum, member) =>
            sum + member.tasks.filter(t => t.status === 'in-progress').length, 0
        );
    };

    const getTodoTasks = () => {
        return Object.values(memberData).reduce((sum, member) =>
            sum + member.tasks.filter(t => t.status === 'todo').length, 0
        );
    };

    const getCompletionRate = () => {
        const total = getTotalTasks();
        const completed = getCompletedTasks();
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const getDaysRemaining = () => {
        const deadline = new Date('2024-12-30');
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Chart data
    const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    const dataPoints = [100, 85, 60, 45, 30, 20];

    // Initialize small chart
    useEffect(() => {
        if (smallChartRef.current) {
            const ctx = smallChartRef.current.getContext('2d');
            if (ctx) {
                if (smallChartInstance.current) {
                    smallChartInstance.current.destroy();
                }
                smallChartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: dataPoints,
                            borderColor: '#475569',
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            }
        }

        return () => {
            if (smallChartInstance.current) {
                smallChartInstance.current.destroy();
            }
        };
    }, []);

    // Initialize pie chart
    useEffect(() => {
        if (pieChartRef.current) {
            const ctx = pieChartRef.current.getContext('2d');
            if (ctx) {
                if (pieChartInstance.current) {
                    pieChartInstance.current.destroy();
                }
                pieChartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Hoàn thành', 'Đang làm', 'Chưa làm'],
                        datasets: [{
                            data: [getCompletedTasks(), getInProgressTasks(), getTodoTasks()],
                            backgroundColor: ['#10b981', '#3b82f6', '#94a3b8'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 10,
                                    font: { size: 11 }
                                }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
        };
    }, [memberData]);

    // Initialize bar chart
    useEffect(() => {
        if (barChartRef.current) {
            const ctx = barChartRef.current.getContext('2d');
            if (ctx) {
                if (barChartInstance.current) {
                    barChartInstance.current.destroy();
                }
                barChartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
                        datasets: [{
                            label: 'Tasks hoàn thành',
                            data: [12, 15, 8, 10, 14],
                            backgroundColor: '#3b82f6',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 5 }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }
        };
    }, []);

    // Initialize big chart when modal opens
    useEffect(() => {
        if (showChartModal && bigChartRef.current) {
            const ctx = bigChartRef.current.getContext('2d');
            if (ctx && !bigChartInstance.current) {
                bigChartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Thực tế',
                                data: dataPoints,
                                borderColor: '#1e3a8a',
                                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.3
                            },
                            {
                                label: 'Kế hoạch',
                                data: [100, 80, 60, 40, 20, 0],
                                borderColor: '#9ca3af',
                                borderDash: [5, 5],
                                borderWidth: 2,
                                pointRadius: 0
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Số lượng Task' }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (!showChartModal && bigChartInstance.current) {
                bigChartInstance.current.destroy();
                bigChartInstance.current = null;
            }
        };
    }, [showChartModal]);

    const handleShowMemberTasks = (memberId: string) => {
        setSelectedMember(memberId);
        setShowTaskModal(true);
    };

    const handleResolveRisk = () => {
        setShowRiskModal(false);
        setRiskResolved(true);

        // Transfer 3 tasks from B to C
        const tasksToMove = memberData['B'].tasks.splice(-3);
        setMemberData({
            ...memberData,
            'C': {
                ...memberData['C'],
                tasks: [...memberData['C'].tasks, ...tasksToMove]
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            'done': 'bg-green-100 text-green-700',
            'in-progress': 'bg-blue-100 text-blue-700',
            'todo': 'bg-gray-100 text-gray-700'
        };
        const labels = {
            'done': 'Hoàn thành',
            'in-progress': 'Đang làm',
            'todo': 'Chưa làm'
        };
        return { class: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] };
    };

    const getPriorityBadge = (priority: string) => {
        const badges = {
            'high': 'bg-red-100 text-red-700',
            'medium': 'bg-yellow-100 text-yellow-700',
            'low': 'bg-gray-100 text-gray-700'
        };
        const labels = {
            'high': 'Cao',
            'medium': 'Trung bình',
            'low': 'Thấp'
        };
        return { class: badges[priority as keyof typeof badges], label: labels[priority as keyof typeof labels] };
    };

    const getFilteredTasks = (tasks: Task[]) => {
        if (filterStatus === 'all') return tasks;
        return tasks.filter(t => t.status === filterStatus);
    };

    return (
        <div className="bg-gray-50 text-slate-800 min-h-screen p-4 md:p-8">
            <header className="mb-8 pb-4 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase tracking-wide">
                    Trang quản lý tiến độ dự án
                </h1>
                <p className="text-gray-600 mt-2">Dashboard tổng quan và phân tích chi tiết</p>
            </header>

            {/* Statistics Cards */}
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Tasks */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Tổng số Task</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{getTotalTasks()}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Đã hoàn thành</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{getCompletedTasks()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Tỷ lệ hoàn thành</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{getCompletionRate()}%</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Days Remaining */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Ngày còn lại</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">{getDaysRemaining()}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="mb-8">
                <h2 className="text-lg font-bold text-slate-700 uppercase mb-4 border-l-4 border-blue-900 pl-3">
                    Biểu đồ phân tích
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Burn-down Chart */}
                    <div
                        onClick={() => setShowChartModal(true)}
                        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition group"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-700">Burn-down Chart</span>
                            <span className="text-green-600 font-bold text-sm">On track</span>
                        </div>
                        <div className="h-40 w-full">
                            <canvas ref={smallChartRef}></canvas>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-bold text-slate-700 mb-2">Phân bổ Task</h3>
                        <div className="h-40 w-full">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-bold text-slate-700 mb-2">Velocity (Tasks/Tuần)</h3>
                        <div className="h-40 w-full">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Overview Section */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-slate-700 uppercase mb-4 border-l-4 border-blue-900 pl-3">
                    Thông tin tổng quan dự án
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Progress Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg text-slate-700 uppercase">Tiến độ:</span>
                            <span className="font-bold text-2xl text-blue-900">70%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-10 p-1">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative striped-bar flex items-center justify-end pr-3" style={{ width: '70%' }}>
                                <span className="text-white text-sm font-bold">70%</span>
                            </div>
                        </div>
                        <div className="text-right mt-3">
                            <span className="text-sm font-semibold text-red-600 italic">Deadline: 30/12/2024</span>
                        </div>
                    </div>

                    {/* Risk Card */}
                    <div className={`rounded-lg shadow-md p-6 ${riskResolved ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'} transition-colors duration-500`}>
                        <div className={`flex justify-between items-center border-b pb-2 mb-3 ${riskResolved ? 'border-green-200' : 'border-red-200'}`}>
                            <span className="font-bold text-slate-700">Rủi ro: {riskResolved ? '0' : '1'}</span>
                            {!riskResolved && <span className="font-bold text-red-600">(HIGH)</span>}
                        </div>

                        {!riskResolved ? (
                            <div>
                                <ul className="list-none space-y-2 text-slate-700 font-medium mb-3">
                                    <li className="flex items-center gap-2">
                                        <span className="text-red-500 font-bold text-xl">⚠</span>
                                        <span>Nhân sự B <span className="text-red-600 font-bold">Overload</span></span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => setShowRiskModal(true)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                    </svg>
                                    Đề xuất xử lý
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-green-600 font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                                <span className="text-lg">Dự án an toàn</span>
                            </div>
                        )}
                    </div>

                    {/* Team Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-bold text-lg text-slate-700 mb-4">Tóm tắt nhóm</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tổng thành viên:</span>
                                <span className="font-bold text-blue-900">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Đang hoạt động:</span>
                                <span className="font-bold text-green-600">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Quá tải:</span>
                                <span className={`font-bold ${riskResolved ? 'text-gray-400' : 'text-red-600'}`}>
                                    {riskResolved ? '0' : '1'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Rảnh rỗi:</span>
                                <span className="font-bold text-blue-600">{riskResolved ? '0' : '1'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members Section */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-slate-700 uppercase mb-4 border-l-4 border-blue-900 pl-3">
                    Thông tin chi tiết từng thành viên <span className="text-xs font-normal lowercase text-gray-400 ml-2">(Nhấn vào để xem task)</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Member A */}
                    <div
                        onClick={() => handleShowMemberTasks('A')}
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                A
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">Thành viên A</h3>
                                <span className="text-sm text-green-600 font-semibold">● Online</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tasks:</span>
                                <span className="font-bold">{memberData['A'].tasks.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hoàn thành:</span>
                                <span className="font-bold text-green-600">
                                    {memberData['A'].tasks.filter(t => t.status === 'done').length}/{memberData['A'].tasks.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="text-green-600 font-bold">OK</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-5 relative overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressBarColor('A')} rounded-full striped-bar transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: `${getMemberCompletionRate('A')}%` }}
                            >
                                {getMemberCompletionRate('A') > 10 && (
                                    <span className="text-xs font-bold text-white drop-shadow">
                                        {getMemberCompletionRate('A')}%
                                    </span>
                                )}
                            </div>
                            {getMemberCompletionRate('A') <= 10 && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">
                                    {getMemberCompletionRate('A')}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Member B */}
                    <div
                        onClick={() => handleShowMemberTasks('B')}
                        className={`rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-2 ${riskResolved ? 'bg-white border-transparent hover:border-blue-500' : 'bg-red-50 border-red-300 hover:border-red-500'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-full ${riskResolved ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'} flex items-center justify-center text-white font-bold text-xl`}>
                                B
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">Thành viên B</h3>
                                <span className="text-sm text-green-600 font-semibold">● Online</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tasks:</span>
                                <span className={`font-bold ${riskResolved ? 'text-slate-700' : 'text-red-600'} text-lg`}>
                                    {memberData['B'].tasks.length} {!riskResolved && '⚠'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hoàn thành:</span>
                                <span className="font-bold text-green-600">
                                    {memberData['B'].tasks.filter(t => t.status === 'done').length}/{memberData['B'].tasks.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-bold ${riskResolved ? 'text-green-600' : 'text-red-600 warning-shake'}`}>
                                    {riskResolved ? 'OK' : 'OVERLOAD'}
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-5 relative overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressBarColor('B')} rounded-full striped-bar transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: `${riskResolved ? getMemberCompletionRate('B') : 95}%` }}
                            >
                                {(riskResolved ? getMemberCompletionRate('B') : 95) > 10 && (
                                    <span className="text-xs font-bold text-white drop-shadow">
                                        {riskResolved ? getMemberCompletionRate('B') : 95}%
                                    </span>
                                )}
                            </div>
                            {(riskResolved ? getMemberCompletionRate('B') : 95) <= 10 && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">
                                    {riskResolved ? getMemberCompletionRate('B') : 95}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Member C */}
                    <div
                        onClick={() => handleShowMemberTasks('C')}
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                C
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">Thành viên C</h3>
                                <span className="text-sm text-green-600 font-semibold">● Online</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tasks:</span>
                                <span className="font-bold">{memberData['C'].tasks.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hoàn thành:</span>
                                <span className="font-bold text-green-600">
                                    {memberData['C'].tasks.filter(t => t.status === 'done').length}/{memberData['C'].tasks.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="text-blue-600 font-bold">{riskResolved ? 'BUSY' : 'FREE'}</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-5 relative overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressBarColor('C')} rounded-full striped-bar transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: `${riskResolved ? 45 : getMemberCompletionRate('C')}%` }}
                            >
                                {(riskResolved ? 45 : getMemberCompletionRate('C')) > 10 && (
                                    <span className="text-xs font-bold text-white drop-shadow">
                                        {riskResolved ? 45 : getMemberCompletionRate('C')}%
                                    </span>
                                )}
                            </div>
                            {(riskResolved ? 45 : getMemberCompletionRate('C')) <= 10 && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">
                                    {riskResolved ? 45 : getMemberCompletionRate('C')}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Activity Timeline */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-slate-700 uppercase mb-4 border-l-4 border-blue-900 pl-3">
                    Hoạt động gần đây
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-blue-900">{activity.member}</span>
                                        {' '}<span className="text-gray-600">{activity.action}</span>{' '}
                                        <span className="font-semibold">"{activity.task}"</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4" onClick={() => setShowTaskModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all scale-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <div>
                                <h3 className="text-2xl font-bold text-blue-900">
                                    {memberData[selectedMember]?.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Tổng: {memberData[selectedMember]?.tasks.length} tasks | Hoàn thành: {getMemberCompletionRate(selectedMember)}%
                                </p>
                            </div>
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="text-gray-400 hover:text-red-500 font-bold text-3xl transition"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Filter */}
                        <div className="mb-4 flex gap-2 flex-wrap">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Tất cả ({memberData[selectedMember]?.tasks.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('done')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterStatus === 'done' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Hoàn thành ({memberData[selectedMember]?.tasks.filter(t => t.status === 'done').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('in-progress')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterStatus === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Đang làm ({memberData[selectedMember]?.tasks.filter(t => t.status === 'in-progress').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('todo')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterStatus === 'todo' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Chưa làm ({memberData[selectedMember]?.tasks.filter(t => t.status === 'todo').length})
                            </button>
                        </div>

                        <ul className="space-y-3">
                            {getFilteredTasks(memberData[selectedMember]?.tasks || []).map((task) => {
                                const statusBadge = getStatusBadge(task.status);
                                const priorityBadge = getPriorityBadge(task.priority);
                                return (
                                    <li key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`w-5 h-5 rounded-full mt-0.5 flex-shrink-0 ${task.status === 'done' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                                <div className="flex-1">
                                                    <p className={`font-semibold text-gray-800 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                                                        {task.name}
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge.class}`}>
                                                            {statusBadge.label}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityBadge.class}`}>
                                                            {priorityBadge.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Risk Resolution Modal */}
            {showRiskModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4" onClick={() => setShowRiskModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border-l-8 border-green-500" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Đề xuất xử lý rủi ro</h3>
                        <p className="text-gray-600 mb-4">
                            Hệ thống phát hiện <strong>Thành viên B</strong> đang quá tải (10 Tasks), trong khi <strong>Thành viên C</strong> đang rảnh.
                        </p>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <p className="font-bold text-blue-900 mb-2">💡 Đề xuất:</p>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">B</span>
                                <span className="text-gray-400 font-semibold">→ chuyển 3 tasks →</span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">C</span>
                            </div>
                            <ul className="list-disc list-inside text-sm text-slate-600 mt-3 space-y-1 pl-2">
                                <li>Task: Fix UI Header</li>
                                <li>Task: Cập nhật API</li>
                                <li>Task: Viết báo cáo tuần</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRiskModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleResolveRisk}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition"
                            >
                                ✓ Đồng ý chuyển
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Modal */}
            {showChartModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4" onClick={() => setShowChartModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowChartModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold transition"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Biểu Đồ Burn-down Chi Tiết</h2>
                        <div className="h-[400px] w-full">
                            <canvas ref={bigChartRef}></canvas>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .striped-bar {
          background-image: linear-gradient(
            45deg,
            rgba(255,255,255,0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 1rem 1rem;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        .warning-shake {
          animation: shake 2s infinite;
        }
      `}</style>
        </div>
    );
};

export default ProjectProgressPage;
