document.addEventListener('DOMContentLoaded', function() {
    // 初始化功能组件
    initPlayground();
    initPricing();
    initProductivityChart();
    initBackToTop();
    initMobileMenu();
    initScrollAnimation();
});

// 互动体验区功能
function initPlayground() {
    // 模式选择功能
    const modeBtns = document.querySelectorAll('.mode-btn');
    const screenPreview = document.getElementById('screen-preview');
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的活跃状态
            modeBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的活跃状态
            this.classList.add('active');
            
            // 获取模式类型
            const mode = this.getAttribute('data-mode');
            
            // 更新预览区域样式
            updateScreenPreview(mode);
        });
    });
    
    // 透明度调节功能
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    
    opacitySlider.addEventListener('input', function() {
        opacityValue.textContent = this.value;
        updateScreenOpacity(this.value);
    });
    
    // Timer mode switching
    const simpleModeRadio = document.getElementById('simple-timer-mode');
    const advancedModeRadio = document.getElementById('advanced-timer-mode');
    const pomodoroModeRadio = document.getElementById('pomodoro-timer-mode');
    const simpleTimerControls = document.getElementById('simple-timer-controls');
    const advancedTimerControls = document.getElementById('advanced-timer-controls');
    const pomodoroTimerControls = document.getElementById('pomodoro-timer-controls');
    
    simpleModeRadio.addEventListener('change', function() {
        if(this.checked) {
            simpleTimerControls.style.display = 'block';
            advancedTimerControls.style.display = 'none';
            pomodoroTimerControls.style.display = 'none';
        }
    });
    
    advancedModeRadio.addEventListener('change', function() {
        if(this.checked) {
            simpleTimerControls.style.display = 'none';
            advancedTimerControls.style.display = 'block';
            pomodoroTimerControls.style.display = 'none';
        }
    });
    
    pomodoroModeRadio.addEventListener('change', function() {
        if(this.checked) {
            simpleTimerControls.style.display = 'none';
            advancedTimerControls.style.display = 'none';
            pomodoroTimerControls.style.display = 'block';
        }
    });
    
    // Timer functionality
    const timerPresets = document.querySelectorAll('.timer-preset');
    const customMinutes = document.getElementById('custom-minutes');
    const startTimerBtn = document.getElementById('start-timer');
    const advancedStartTimerBtn = document.getElementById('advanced-start-timer');
    const timerCountdown = document.getElementById('timer-countdown');
    const showCountdownToggle = document.getElementById('show-countdown-toggle');
    const showClockToggle = document.getElementById('show-clock-toggle');
    const showMessageToggle = document.getElementById('show-message-toggle');
    const customMessage = document.getElementById('custom-message');
    const previewMessage = document.querySelector('.preview-message');
    const currentTimeDisplay = document.getElementById('current-time');
    const startTimeSelector = document.getElementById('start-time-selector');
    const startTimeValue = document.getElementById('start-time-value');
    const endTimeSelector = document.getElementById('end-time-selector');
    const endTimeValue = document.getElementById('end-time-value');
    
    let countdownInterval;
    let remainingSeconds = 0;
    
    // Display toggles
    showCountdownToggle.addEventListener('change', function() {
        timerCountdown.style.display = this.checked ? 'block' : 'none';
    });
    
    showClockToggle.addEventListener('change', function() {
        currentTimeDisplay.style.display = this.checked ? 'block' : 'none';
    });
    
    showMessageToggle.addEventListener('change', function() {
        previewMessage.style.display = this.checked ? 'block' : 'none';
    });
    
    customMessage.addEventListener('input', function() {
        previewMessage.textContent = this.value || "专注模式已启动";
    });
    
    // 开始时间选择
    if(startTimeSelector) {
        startTimeSelector.addEventListener('change', function() {
            if(this.value === 'now') {
                startTimeValue.style.display = 'none';
            } else {
                startTimeValue.style.display = 'inline-block';
                startTimeValue.placeholder = this.value === 'after' ? '分钟后开始' : '具体时间';
            }
        });
    }

    // 结束时间选择
    if(endTimeSelector) {
        endTimeSelector.addEventListener('change', function() {
            if(this.value === 'timer') {
                endTimeValue.style.display = 'none';
            } else {
                endTimeValue.style.display = 'inline-block';
                endTimeValue.placeholder = this.value === 'after' ? '分钟后结束' : '具体时间';
            }
        });
    }
    
    timerPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-time'));
            customMinutes.value = minutes;
            startSimpleTimer(minutes);
        });
    });
    
    startTimerBtn.addEventListener('click', function() {
        const minutes = parseInt(customMinutes.value) || 25;
        startSimpleTimer(minutes);
    });
    
    advancedStartTimerBtn.addEventListener('click', function() {
        startAdvancedTimer();
    });
    
    function startSimpleTimer(minutes) {
        clearTimerIfRunning();
        remainingSeconds = minutes * 60;
        updateTimerDisplay(remainingSeconds);
        
        countdownInterval = setInterval(function() {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                handleTimerCompletion();
            } else {
                updateTimerDisplay(remainingSeconds);
            }
        }, 1000);
    }
    
    function startAdvancedTimer() {
        const startOption = startTimeSelector.value;
        const endOption = endTimeSelector.value;
        
        // Handle start time option
        if (startOption === 'now') {
            // For immediate start, determine the duration
            handleEndTimeOption(endOption, endTimeValue.value);
        } else if (startOption === 'after') {
            // Delayed start after specified minutes
            const delayMinutes = parseInt(startTimeValue.value);
            if (!isNaN(delayMinutes) && delayMinutes > 0) {
                alert(`计时器将在 ${delayMinutes} 分钟后启动`);
                setTimeout(() => {
                    handleEndTimeOption(endOption, endTimeValue.value);
                }, delayMinutes * 60000);
            } else {
                alert('请输入有效的延时分钟数');
            }
        } else if (startOption === 'at') {
            // Start at specific time
            const timeValue = startTimeValue.value;
            const timeParts = timeValue.split(':');
            if (timeParts.length === 2) {
                const hours = parseInt(timeParts[0]);
                const minutes = parseInt(timeParts[1]);
                if (!isNaN(hours) && !isNaN(minutes)) {
                    const startTime = new Date();
                    startTime.setHours(hours, minutes, 0);
                    
                    if (startTime > new Date()) {
                        const diffMs = startTime - new Date();
                        alert(`计时器将在 ${timeValue} 启动`);
                        setTimeout(() => {
                            handleEndTimeOption(endOption, endTimeValue.value);
                        }, diffMs);
                    } else {
                        alert('请设置未来的时间');
                    }
                } else {
                    alert('请输入有效的时间格式 (HH:MM)');
                }
            } else {
                alert('请输入有效的时间格式 (HH:MM)');
            }
        }
    }
    
    function handleEndTimeOption(endOption, value) {
        if (endOption === 'timer') {
            // Use the custom minutes value from simple mode
            const minutes = parseInt(customMinutes.value) || 25;
            startSimpleTimer(minutes);
        } else if (endOption === 'after') {
            // Run for specified duration
            const durationMinutes = parseInt(value);
            if (!isNaN(durationMinutes) && durationMinutes > 0) {
                startSimpleTimer(durationMinutes);
            } else {
                alert('请输入有效的持续时间');
            }
        } else if (endOption === 'at') {
            // Run until specific time
            const timeValue = value;
            const timeParts = timeValue.split(':');
            if (timeParts.length === 2) {
                const hours = parseInt(timeParts[0]);
                const minutes = parseInt(timeParts[1]);
                if (!isNaN(hours) && !isNaN(minutes)) {
                    const endTime = new Date();
                    endTime.setHours(hours, minutes, 0);
                    
                    if (endTime > new Date()) {
                        const diffMs = endTime - new Date();
                        const durationMinutes = Math.ceil(diffMs / 60000);
                        startSimpleTimer(durationMinutes);
                    } else {
                        alert('请设置未来的时间');
                    }
                } else {
                    alert('请输入有效的时间格式 (HH:MM)');
                }
            } else {
                alert('请输入有效的时间格式 (HH:MM)');
            }
        }
    }
    
    function clearTimerIfRunning() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }
    
    function handleTimerCompletion() {
        clearTimerIfRunning();
        timerCountdown.textContent = "时间到！";
        setTimeout(() => {
            const minutes = parseInt(customMinutes.value) || 25;
            updateTimerDisplay(minutes * 60);
        }, 3000);
    }
    
    // Pomodoro functionality
    const pomodoroWorkInput = document.getElementById('pomodoro-work');
    const pomodoroRestInput = document.getElementById('pomodoro-rest');
    const pomodoroLongRestInput = document.getElementById('pomodoro-long-rest');
    const pomodoroCyclesInput = document.getElementById('pomodoro-cycles');
    const startPomodoroBtn = document.getElementById('start-pomodoro');
    const pomodoroPhaseDisplay = document.getElementById('pomodoro-phase');
    const pomodoroCycleDisplay = document.getElementById('pomodoro-cycle');
    const pomodoroStatus = document.querySelector('.pomodoro-status');
    
    let pomodoroTimer;
    let currentPhase = 'work'; // 'work', 'rest', 'longRest'
    let currentCycle = 0;
    let totalCycles = 4;
    
    startPomodoroBtn.addEventListener('click', function() {
        const workMinutes = parseInt(pomodoroWorkInput.value) || 25;
        const restMinutes = parseInt(pomodoroRestInput.value) || 5;
        const longRestMinutes = parseInt(pomodoroLongRestInput.value) || 15;
        totalCycles = parseInt(pomodoroCyclesInput.value) || 4;
        
        // Reset pomodoro state
        currentPhase = 'work';
        currentCycle = 1;
        
        // Show status
        pomodoroStatus.style.display = 'block';
        updatePomodoroDisplay();
        
        // Start first work session
        startPomodoroPhase(workMinutes);
    });
    
    function startPomodoroPhase(minutes) {
        // Clear any existing timer
        clearTimerIfRunning();
        
        // Setup new timer
        remainingSeconds = minutes * 60;
        updateTimerDisplay(remainingSeconds);
        
        // Update display based on current phase
        updatePomodoroDisplay();
        
        // Start countdown
        countdownInterval = setInterval(function() {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                handlePomodoroPhaseCompletion();
            } else {
                updateTimerDisplay(remainingSeconds);
            }
        }, 1000);
    }
    
    function handlePomodoroPhaseCompletion() {
        clearInterval(countdownInterval);
        
        // Play notification sound or alert
        alert('Pomodoro ' + currentPhase + ' phase completed!');
        
        // Determine next phase
        if (currentPhase === 'work') {
            // After work period, take a rest
            currentPhase = (currentCycle % totalCycles === 0) ? 'longRest' : 'rest';
            
            // Start rest phase
            const nextMinutes = (currentPhase === 'longRest') 
                ? parseInt(pomodoroLongRestInput.value) || 15
                : parseInt(pomodoroRestInput.value) || 5;
            
            startPomodoroPhase(nextMinutes);
        } else {
            // After rest, start next work cycle
            if (currentPhase === 'longRest') {
                // A full cycle is completed after a long rest
                currentCycle = 1;
            } else {
                // Increment cycle after a regular rest
                currentCycle++;
            }
            
            currentPhase = 'work';
            startPomodoroPhase(parseInt(pomodoroWorkInput.value) || 25);
        }
    }
    
    function updatePomodoroDisplay() {
        let phaseText = '';
        switch(currentPhase) {
            case 'work':
                phaseText = '工作阶段';
                break;
            case 'rest':
                phaseText = '短休息阶段';
                break;
            case 'longRest':
                phaseText = '长休息阶段';
                break;
        }
        
        pomodoroPhaseDisplay.textContent = phaseText;
        pomodoroCycleDisplay.textContent = `(周期 ${currentCycle}/${totalCycles})`;
    }
    
    // 社交分享功能
    const shareStatusBtn = document.getElementById('share-status');
    const sharePreview = document.querySelector('.share-preview');
    const shareBtns = document.querySelectorAll('.share-btn');
    const inviteFriendsBtn = document.getElementById('invite-friends');
    
    shareStatusBtn.addEventListener('click', function() {
        sharePreview.style.display = sharePreview.style.display === 'none' ? 'block' : 'none';
    });
    
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            shareToSocialMedia(platform);
        });
    });
    
    if(inviteFriendsBtn) {
        inviteFriendsBtn.addEventListener('click', function() {
            const inviteLink = window.location.href + '?join=focus-group-' + Math.floor(Math.random() * 1000);
            alert(`邀请链接已生成: ${inviteLink}\n请分享给你的朋友，一起进入专注模式！`);
        });
    }
    
    // 全屏功能
    const toggleFullscreenBtn = document.getElementById('toggle-fullscreen');
    let isFullscreen = false;
    
    toggleFullscreenBtn.addEventListener('click', function() {
        toggleFullscreen();
    });
    
    // 初始化当前时间显示
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 显示预览区内容
    sharePreview.style.display = 'none';
    
    // 辅助函数
    function updateScreenPreview(mode) {
        // 移除之前的所有模式类
        screenPreview.classList.remove('mode-black', 'mode-white', 'mode-blue', 'mode-green', 'mode-gradient');
        
        // 根据选择的模式设置背景
        switch(mode) {
            case 'black':
                screenPreview.style.backgroundColor = '#000000';
                screenPreview.style.backgroundImage = 'none';
                break;
            case 'white':
                screenPreview.style.backgroundColor = '#ffffff';
                screenPreview.style.backgroundImage = 'none';
                // 更改文字颜色以在白色背景上可见
                document.querySelector('.preview-content').style.color = '#333';
                break;
            case 'blue':
                screenPreview.style.backgroundColor = '#3498db';
                screenPreview.style.backgroundImage = 'none';
                // 恢复文字颜色
                document.querySelector('.preview-content').style.color = '#fff';
                break;
            case 'green':
                screenPreview.style.backgroundColor = '#2ecc71';
                screenPreview.style.backgroundImage = 'none';
                // 恢复文字颜色
                document.querySelector('.preview-content').style.color = '#fff';
                break;
            case 'gradient':
                screenPreview.style.backgroundColor = 'transparent';
                screenPreview.style.backgroundImage = 'linear-gradient(135deg, #6c63ff, #3498db)';
                // 恢复文字颜色
                document.querySelector('.preview-content').style.color = '#fff';
                break;
        }
    }
    
    function updateScreenOpacity(value) {
        screenPreview.style.opacity = value / 100;
    }
    
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerCountdown.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    function shareToSocialMedia(platform) {
        const message = "我正在使用SuperBlackScreen，专注工作中！";
        const url = window.location.href;
        
        let shareUrl;
        
        switch(platform) {
            case 'wechat':
                alert('微信扫一扫二维码分享');
                break;
            case 'weibo':
                shareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'instagram':
                alert('Instagram不支持直接分享链接，请截图并在Instagram App中分享');
                break;
            case 'qq':
                shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`;
                window.open(shareUrl, '_blank');
                break;
        }
    }
    
    function toggleFullscreen() {
        if (!isFullscreen) {
            // 进入全屏模式
            if (screenPreview.requestFullscreen) {
                screenPreview.requestFullscreen();
            } else if (screenPreview.mozRequestFullScreen) {
                screenPreview.mozRequestFullScreen();
            } else if (screenPreview.webkitRequestFullscreen) {
                screenPreview.webkitRequestFullscreen();
            } else if (screenPreview.msRequestFullscreen) {
                screenPreview.msRequestFullscreen();
            }
            
            toggleFullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> 退出全屏';
        } else {
            // 退出全屏模式
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            toggleFullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> 全屏模式';
        }
        
        isFullscreen = !isFullscreen;
    }
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', updateFullscreenButtonState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButtonState);
    document.addEventListener('mozfullscreenchange', updateFullscreenButtonState);
    document.addEventListener('MSFullscreenChange', updateFullscreenButtonState);
    
    function updateFullscreenButtonState() {
        if (document.fullscreenElement || document.webkitFullscreenElement || 
            document.mozFullScreenElement || document.msFullscreenElement) {
            isFullscreen = true;
            toggleFullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> 退出全屏';
        } else {
            isFullscreen = false;
            toggleFullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> 全屏模式';
        }
    }
}

// 价格切换功能
function initPricing() {
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    
    billingToggle.addEventListener('change', function() {
        if (this.checked) {
            // 年付
            monthlyPrices.forEach(el => el.style.display = 'none');
            yearlyPrices.forEach(el => el.style.display = 'inline');
        } else {
            // 月付
            monthlyPrices.forEach(el => el.style.display = 'inline');
            yearlyPrices.forEach(el => el.style.display = 'none');
        }
    });
    
    // 默认显示月付价格
    yearlyPrices.forEach(el => el.style.display = 'none');
}

// 生产力图表
function initProductivityChart() {
    if (!document.getElementById('productivity-chart')) return;
    
    const ctx = document.getElementById('productivity-chart').getContext('2d');
    
    const data = {
        labels: [
            document.querySelector('[data-i18n-key="stats.graph.days.monday"]')?.textContent || '周一', 
            document.querySelector('[data-i18n-key="stats.graph.days.tuesday"]')?.textContent || '周二', 
            document.querySelector('[data-i18n-key="stats.graph.days.wednesday"]')?.textContent || '周三', 
            document.querySelector('[data-i18n-key="stats.graph.days.thursday"]')?.textContent || '周四', 
            document.querySelector('[data-i18n-key="stats.graph.days.friday"]')?.textContent || '周五', 
            document.querySelector('[data-i18n-key="stats.graph.days.saturday"]')?.textContent || '周六', 
            document.querySelector('[data-i18n-key="stats.graph.days.sunday"]')?.textContent || '周日'
        ],
        datasets: [
            {
                label: document.querySelector('[data-i18n-key="stats.graph.before"]')?.textContent || '使用前专注时间',
                data: [2, 1.5, 2.5, 1, 2, 0.5, 1],
                backgroundColor: 'rgba(180, 180, 180, 0.2)',
                borderColor: 'rgba(180, 180, 180, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(180, 180, 180, 1)',
                tension: 0.4
            },
            {
                label: document.querySelector('[data-i18n-key="stats.graph.after"]')?.textContent || '使用后专注时间',
                data: [3.5, 4, 5, 3, 4.5, 3, 3.5],
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                borderColor: 'rgba(108, 99, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(108, 99, 255, 1)',
                tension: 0.4
            }
        ]
    };
    
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: document.querySelector('[data-i18n-key="stats.graph.y_axis"]')?.textContent || '专注时间 (小时)'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw}小时`;
                    }
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// 回到顶部按钮功能
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 移动端菜单功能
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // 添加移动端菜单的CSS
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-list {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                background-color: white;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                transform: translateY(-150%);
                transition: transform 0.3s ease-in-out;
                z-index: 900;
            }
            
            .nav-list.active {
                transform: translateY(0);
            }
            
            .nav-list li {
                margin: 10px 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -7px);
            }
        }
    `;
    document.head.appendChild(style);
}

// 滚动动画
function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .solution-card, .stat-card');
    
    // 添加初始类
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 检查元素是否在视口中
    function checkInView() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.85) {
                el.style.opacity = '1';
            }
        });
    }
    
    // 初始检查
    checkInView();
    
    // 滚动时检查
    window.addEventListener('scroll', checkInView);
}