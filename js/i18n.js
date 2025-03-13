document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        // Set the current language based on stored preference or default
        const currentLang = localStorage.getItem('preferred-language') || 'zh-CN';
        languageSelector.value = currentLang;
        
        // Load language on page load
        loadLanguage(currentLang);
        
        // Handle language change
        languageSelector.addEventListener('change', function() {
            const selectedLang = this.value;
            loadLanguage(selectedLang);
            localStorage.setItem('preferred-language', selectedLang);
        });
    }
});

function loadLanguage(lang) {
    fetch(`locale/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Language file not found');
            }
            return response.json();
        })
        .then(data => {
            updatePageContent(data);
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}

function updatePageContent(translations) {
    // Update meta tags
    if (translations.meta) {
        document.title = translations.meta.title || document.title;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && translations.meta.description) {
            metaDescription.content = translations.meta.description;
        }
    }
    
    // Update navigation
    if (translations.nav) {
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            const key = link.getAttribute('data-i18n-key');
            if (key && translations.nav[key]) {
                link.textContent = translations.nav[key];
            }
        });
    }
    
    // Update hero section
    if (translations.hero) {
        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const ctaPrimary = document.querySelector('.hero-cta .btn-primary');
        const ctaSecondary = document.querySelector('.hero-cta .btn-secondary');
        
        if (heroTitle && translations.hero.title) {
            heroTitle.innerHTML = translations.hero.title;
        }
        
        if (heroSubtitle && translations.hero.subtitle) {
            heroSubtitle.textContent = translations.hero.subtitle;
        }
        
        if (ctaPrimary && translations.hero.cta_primary) {
            ctaPrimary.textContent = translations.hero.cta_primary;
        }
        
        if (ctaSecondary && translations.hero.cta_secondary) {
            ctaSecondary.textContent = translations.hero.cta_secondary;
        }
        
        // Update hero stats
        if (translations.hero.stats) {
            if (translations.hero.stats.productivity) {
                const productivityStat = document.querySelector('.hero-stats .stat:nth-child(1)');
                if (productivityStat) {
                    const numberElement = productivityStat.querySelector('.stat-number');
                    const textElement = productivityStat.querySelector('.stat-text');
                    
                    if (numberElement && translations.hero.stats.productivity.number) {
                        numberElement.textContent = translations.hero.stats.productivity.number;
                    }
                    
                    if (textElement && translations.hero.stats.productivity.text) {
                        textElement.textContent = translations.hero.stats.productivity.text;
                    }
                }
            }
            
            if (translations.hero.stats.eye_strain) {
                const eyeStrainStat = document.querySelector('.hero-stats .stat:nth-child(2)');
                if (eyeStrainStat) {
                    const numberElement = eyeStrainStat.querySelector('.stat-number');
                    const textElement = eyeStrainStat.querySelector('.stat-text');
                    
                    if (numberElement && translations.hero.stats.eye_strain.number) {
                        numberElement.textContent = translations.hero.stats.eye_strain.number;
                    }
                    
                    if (textElement && translations.hero.stats.eye_strain.text) {
                        textElement.textContent = translations.hero.stats.eye_strain.text;
                    }
                }
            }
            
            if (translations.hero.stats.users) {
                const usersStat = document.querySelector('.hero-stats .stat:nth-child(3)');
                if (usersStat) {
                    const numberElement = usersStat.querySelector('.stat-number');
                    const textElement = usersStat.querySelector('.stat-text');
                    
                    if (numberElement && translations.hero.stats.users.number) {
                        numberElement.textContent = translations.hero.stats.users.number;
                    }
                    
                    if (textElement && translations.hero.stats.users.text) {
                        textElement.textContent = translations.hero.stats.users.text;
                    }
                }
            }
        }
    }
    
    // Update features section
    if (translations.features) {
        const featuresTitle = document.querySelector('#features .section-header h2');
        const featuresSubtitle = document.querySelector('#features .section-header p');
        
        if (featuresTitle && translations.features.title) {
            featuresTitle.textContent = translations.features.title;
        }
        
        if (featuresSubtitle && translations.features.subtitle) {
            featuresSubtitle.textContent = translations.features.subtitle;
        }
        
        // Update feature cards if translations available
        if (translations.features.cards) {
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach((card, index) => {
                if (translations.features.cards[index]) {
                    const title = card.querySelector('h3');
                    const desc = card.querySelector('p');
                    
                    if (title && translations.features.cards[index].title) {
                        title.textContent = translations.features.cards[index].title;
                    }
                    
                    if (desc && translations.features.cards[index].description) {
                        desc.textContent = translations.features.cards[index].description;
                    }
                }
            });
        }
    }
    
    // Update playground section
    if (translations.playground) {
        const playgroundTitle = document.querySelector('#playground .section-header h2');
        const playgroundSubtitle = document.querySelector('#playground .section-header p');
        
        if (playgroundTitle && translations.playground.title) {
            playgroundTitle.textContent = translations.playground.title;
        }
        
        if (playgroundSubtitle && translations.playground.subtitle) {
            playgroundSubtitle.textContent = translations.playground.subtitle;
        }
        
        // Update preview message
        const previewMessage = document.querySelector('.preview-message');
        if (previewMessage && translations.playground.preview_message) {
            previewMessage.textContent = translations.playground.preview_message;
        }
        
        // Update control labels
        if (translations.playground.controls) {
            // Screen Mode
            const screenModeTitle = document.querySelector('.playground-controls .control-group:nth-child(1) h3');
            if (screenModeTitle && translations.playground.controls.screen_mode) {
                screenModeTitle.textContent = translations.playground.controls.screen_mode;
            }
            
            // Update mode buttons
            const modeButtons = document.querySelectorAll('.mode-btn');
            if (translations.playground.controls.modes) {
                modeButtons.forEach(btn => {
                    const mode = btn.getAttribute('data-mode');
                    if (mode && translations.playground.controls.modes[mode]) {
                        const modeName = btn.querySelector('.mode-name');
                        if (modeName) {
                            modeName.textContent = translations.playground.controls.modes[mode];
                        }
                    }
                });
            }
            
            // Opacity
            const opacityTitle = document.querySelector('.playground-controls .control-group:nth-child(2) h3');
            if (opacityTitle && translations.playground.controls.opacity) {
                opacityTitle.textContent = translations.playground.controls.opacity;
            }
            
            // Timer
            const timerTitle = document.querySelector('.playground-controls .control-group:nth-child(3) h3');
            if (timerTitle && translations.playground.controls.timer) {
                timerTitle.textContent = translations.playground.controls.timer.title;
            }
            
            // Timer mode labels
            if (translations.playground.controls.timer && translations.playground.controls.timer.modes) {
                const simpleModeLabel = document.querySelector('label[for="simple-timer-mode"]');
                const advancedModeLabel = document.querySelector('label[for="advanced-timer-mode"]');
                const pomodoroModeLabel = document.querySelector('label[for="pomodoro-timer-mode"]');
                
                if (simpleModeLabel && translations.playground.controls.timer.modes.simple) {
                    simpleModeLabel.textContent = translations.playground.controls.timer.modes.simple;
                }
                
                if (advancedModeLabel && translations.playground.controls.timer.modes.advanced) {
                    advancedModeLabel.textContent = translations.playground.controls.timer.modes.advanced;
                }
                
                if (pomodoroModeLabel && translations.playground.controls.timer.modes.pomodoro) {
                    pomodoroModeLabel.textContent = translations.playground.controls.timer.modes.pomodoro;
                }
            }
            
            // Timer presets
            if (translations.playground.controls.timer && translations.playground.controls.timer.presets) {
                const timerPresets = document.querySelectorAll('.timer-preset');
                timerPresets.forEach(preset => {
                    const time = preset.getAttribute('data-time');
                    if (time && translations.playground.controls.timer.presets[time]) {
                        preset.textContent = translations.playground.controls.timer.presets[time];
                    }
                });
            }
            
            // Button labels
            if (translations.playground.controls.timer && translations.playground.controls.timer.buttons) {
                const startTimerBtn = document.getElementById('start-timer');
                const advancedStartTimerBtn = document.getElementById('advanced-start-timer');
                const startPomodoroBtn = document.getElementById('start-pomodoro');
                
                if (startTimerBtn && translations.playground.controls.timer.buttons.start) {
                    startTimerBtn.textContent = translations.playground.controls.timer.buttons.start;
                }
                
                if (advancedStartTimerBtn && translations.playground.controls.timer.buttons.advanced_start) {
                    advancedStartTimerBtn.textContent = translations.playground.controls.timer.buttons.advanced_start;
                }
                
                if (startPomodoroBtn && translations.playground.controls.timer.buttons.start_pomodoro) {
                    startPomodoroBtn.textContent = translations.playground.controls.timer.buttons.start_pomodoro;
                }
            }
            
            // Share section
            const shareTitle = document.querySelector('.playground-controls .control-group:nth-child(4) h3');
            if (shareTitle && translations.playground.controls.share) {
                shareTitle.textContent = translations.playground.controls.share.title;
            }
            
            if (translations.playground.controls.share && translations.playground.controls.share.buttons) {
                const shareStatusBtn = document.getElementById('share-status');
                const inviteFriendsBtn = document.getElementById('invite-friends');
                
                if (shareStatusBtn && translations.playground.controls.share.buttons.share_status) {
                    shareStatusBtn.innerHTML = `<i class="fas fa-share-alt"></i> ${translations.playground.controls.share.buttons.share_status}`;
                }
                
                if (inviteFriendsBtn && translations.playground.controls.share.buttons.invite_friends) {
                    inviteFriendsBtn.innerHTML = `<i class="fas fa-user-friends"></i> ${translations.playground.controls.share.buttons.invite_friends}`;
                }
            }
        }
    }
    
    // Update comparison section
    if (translations.comparison) {
        const comparisonTitle = document.querySelector('#comparison .section-header h2');
        const comparisonSubtitle = document.querySelector('#comparison .section-header p');
        
        if (comparisonTitle && translations.comparison.title) {
            comparisonTitle.textContent = translations.comparison.title;
        }
        
        if (comparisonSubtitle && translations.comparison.subtitle) {
            comparisonSubtitle.textContent = translations.comparison.subtitle;
        }
    }
    
    // Update painpoints section
    if (translations.painpoints) {
        const painpointsTitle = document.querySelector('#painpoints .section-header h2');
        const painpointsSubtitle = document.querySelector('#painpoints .section-header p');
        
        if (painpointsTitle && translations.painpoints.title) {
            painpointsTitle.textContent = translations.painpoints.title;
        }
        
        if (painpointsSubtitle && translations.painpoints.subtitle) {
            painpointsSubtitle.textContent = translations.painpoints.subtitle;
        }
    }
    
    // Update stats section
    if (translations.stats) {
        const statsTitle = document.querySelector('#stats .section-header h2');
        const statsSubtitle = document.querySelector('#stats .section-header p');
        
        if (statsTitle && translations.stats.title) {
            statsTitle.textContent = translations.stats.title;
        }
        
        if (statsSubtitle && translations.stats.subtitle) {
            statsSubtitle.textContent = translations.stats.subtitle;
        }
        
        // Update chart if it exists
        const chart = Chart.instances[0];
        if (chart && translations.stats.graph) {
            // Update days
            if (translations.stats.graph.days) {
                chart.data.labels = [
                    translations.stats.graph.days.monday,
                    translations.stats.graph.days.tuesday,
                    translations.stats.graph.days.wednesday,
                    translations.stats.graph.days.thursday,
                    translations.stats.graph.days.friday,
                    translations.stats.graph.days.saturday,
                    translations.stats.graph.days.sunday
                ];
            }
            
            // Update dataset labels
            if (translations.stats.graph.before) {
                chart.data.datasets[0].label = translations.stats.graph.before;
            }
            
            if (translations.stats.graph.after) {
                chart.data.datasets[1].label = translations.stats.graph.after;
            }
            
            // Update y-axis title
            if (translations.stats.graph.y_axis) {
                chart.options.scales.y.title.text = translations.stats.graph.y_axis;
            }
            
            chart.update();
        }
    }
    
    // Update pricing section
    if (translations.pricing) {
        const pricingTitle = document.querySelector('#pricing .section-header h2');
        const pricingSubtitle = document.querySelector('#pricing .section-header p');
        
        if (pricingTitle && translations.pricing.title) {
            pricingTitle.textContent = translations.pricing.title;
        }
        
        if (pricingSubtitle && translations.pricing.subtitle) {
            pricingSubtitle.textContent = translations.pricing.subtitle;
        }
    }
    
    // Update CTA section
    if (translations.cta) {
        const ctaTitle = document.querySelector('.cta-section h2');
        const ctaSubtitle = document.querySelector('.cta-section p');
        const ctaButton = document.querySelector('.cta-section .btn');
        
        if (ctaTitle && translations.cta.title) {
            ctaTitle.textContent = translations.cta.title;
        }
        
        if (ctaSubtitle && translations.cta.subtitle) {
            ctaSubtitle.textContent = translations.cta.subtitle;
        }
        
        if (ctaButton && translations.cta.button) {
            ctaButton.textContent = translations.cta.button;
        }
    }
    
    // Update footer
    if (translations.footer) {
        // Footer columns
        const footerColumnTitles = document.querySelectorAll('.footer-col h4');
        if (translations.footer.columns) {
            footerColumnTitles.forEach((title, index) => {
                if (translations.footer.columns[index]) {
                    title.textContent = translations.footer.columns[index];
                }
            });
        }
        
        // Copyright
        const copyright = document.querySelector('.copyright p');
        if (copyright && translations.footer.copyright) {
            copyright.textContent = translations.footer.copyright;
        }
    }
    
    // Handle general data-i18n-key elements
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        const keyParts = key.split('.');
        
        let value = translations;
        for (const part of keyParts) {
            if (value === undefined || value[part] === undefined) {
                return;
            }
            value = value[part];
        }
        
        if (typeof value === 'string') {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder') !== null) {
                    element.placeholder = value;
                } else {
                    element.value = value;
                }
            } else {
                element.innerHTML = value;
            }
        }
    });
}