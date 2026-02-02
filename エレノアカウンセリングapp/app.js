/* ========================================
   Eleanor spa&treatment - カウンセリングアプリ
   JavaScript Application Logic
   ======================================== */

// アプリの状態管理
const appState = {
    currentStep: 1,
    nomination: null,
    selectedMenus: [],
    bleachPrice: 4000,
    selectedCourse: null,
    selectedCare: null,
    selectedTreatment: null,
    hasStraightening: false,
    hasCreamSpa: false,
    showingCreamSpaDetail: false,
    showingStraighteningDetail: false,
    showingTreatmentSelection: false,
    autoSelectedCourse: false // 縮毛矯正などで自動選択されたかどうかのフラグ
};

// 価格設定
const PRICES = {
    nomination: 550,
    menus: {
        cut: 4500,
        color: 4500,
        bleach: 4000,
        straightening: 11000,
        perm: 6000,
        spa: 1500,
        creamspa: 4000,
        eyebrow: 1100,
        bangs: 1100
    },
    courses: {
        light: 2000,
        basic: 4000,
        premium: 7000
    },
    care: {
        keraforce: 1000,
        angie: 1000,
        nectar: 1000
    }
};

// メニュー名のマッピング
const MENU_NAMES = {
    cut: 'カット',
    color: 'カラー',
    bleach: 'ブリーチ',
    straightening: '縮毛矯正',
    perm: 'パーマ',
    spa: 'スパシャンプー&ブロー',
    creamspa: 'クリームヘッドスパ',
    eyebrow: '眉カット',
    bangs: '前髪カット'
};

// コース名のマッピング
const COURSE_NAMES = {
    light: 'ライトコース',
    basic: 'ベーシックコース',
    premium: 'プレミアムコース'
};

// ケア剤名のマッピング
const CARE_NAMES = {
    keraforce: 'ケラフォース',
    angie: 'アンジー',
    nectar: 'ネクター'
};

// トリートメント名のマッピング
const TREATMENT_NAMES = {
    alkali: 'アルカリ酸熱トリートメント',
    acid: '酸熱トリートメント'
};

// DOM要素の初期化
document.addEventListener('DOMContentLoaded', () => {
    initNominationRadio();
    initMenuCards();
    initOptionCheckboxes();
    initPriceSliders();
    initCourseCards();
    initCareCards();
    initTreatmentCards();
});

// 指名料ラジオボタンの初期化
function initNominationRadio() {
    const radios = document.querySelectorAll('input[name="nomination"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            appState.nomination = radio.value === 'true';
        });
    });
    appState.nomination = false;
}

// メニューカードの初期化
function initMenuCards() {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // スライダーのクリックは無視
            if (e.target.classList.contains('price-slider')) return;

            const menu = card.dataset.menu;

            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                appState.selectedMenus = appState.selectedMenus.filter(m => m !== menu);

                // スライダーを表示している場合は非表示に
                const sliderContainer = card.querySelector('.price-slider-container');
                if (sliderContainer) {
                    sliderContainer.style.display = 'none';
                }

                if (menu === 'straightening') {
                    appState.hasStraightening = false;
                    // 自動選択されていたコースを解除
                    if (appState.autoSelectedCourse) {
                        appState.selectedCourse = null;
                        appState.autoSelectedCourse = false;
                        document.querySelectorAll('.course-card').forEach(c => c.classList.remove('selected', 'disabled'));
                    }
                }

                if (menu === 'creamspa') {
                    appState.hasCreamSpa = false;
                }
            } else {
                card.classList.add('selected');
                appState.selectedMenus.push(menu);

                // スライダーを表示
                const sliderContainer = card.querySelector('.price-slider-container');
                if (sliderContainer) {
                    sliderContainer.style.display = 'block';
                }

                if (menu === 'straightening') {
                    appState.hasStraightening = true;
                }

                if (menu === 'creamspa') {
                    appState.hasCreamSpa = true;
                }
            }

            updateNextButton();
        });
    });
}

// 追加オプション（眉カット、前髪カット、スパシャンプー&ブロー）の初期化
function initOptionCheckboxes() {
    const checkboxes = document.querySelectorAll('.option-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const menu = checkbox.dataset.menu;
            const price = parseInt(checkbox.dataset.price);

            if (checkbox.checked) {
                if (!appState.selectedMenus.includes(menu)) {
                    appState.selectedMenus.push(menu);
                }
            } else {
                appState.selectedMenus = appState.selectedMenus.filter(m => m !== menu);
            }
            updateNextButton();
        });
    });
}

// 価格スライダーの初期化（カラー、ブリーチ、縮毛矯正、パーマ）
function initPriceSliders() {
    const sliders = document.querySelectorAll('.price-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const target = slider.dataset.target;
            const value = parseInt(e.target.value);

            // メニューカードの価格表示を更新
            const menuCard = slider.closest('.menu-card');
            if (menuCard) {
                const priceDisplay = menuCard.querySelector('.menu-price');
                if (priceDisplay) {
                    priceDisplay.textContent = `¥${value.toLocaleString()}`;
                }
            }

            // appStateの価格を更新
            PRICES.menus[target] = value;

        });

        slider.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// コースカードの初期化
function initCourseCards() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('disabled')) return;

            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            appState.selectedCourse = card.dataset.course;

            updateNextButton();
        });
    });
}

// ケア剤カードの初期化
function initCareCards() {
    const cards = document.querySelectorAll('.care-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            appState.selectedCare = card.dataset.care;

            updateNextButton();
        });
    });
}

// トリートメントカードの初期化
function initTreatmentCards() {
    const cards = document.querySelectorAll('.treatment-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            appState.selectedTreatment = card.dataset.treatment;

            // トリートメント選択画面の次へボタンを有効化
            const nextBtn = document.querySelector('#stepTreatment .next-btn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });
}

// 次へボタンの状態更新
function updateNextButton() {
    const currentStep = appState.currentStep;
    const nextBtn = document.querySelector(`#step${currentStep} .next-btn`);

    if (!nextBtn) return;

    switch (currentStep) {
        case 1:
            nextBtn.disabled = appState.selectedMenus.length === 0;
            break;
        case 2:
            // カラー、ブリーチ、パーマが選択されている場合はコース選択必須
            const requiresCourse = appState.selectedMenus.some(m => ['color', 'bleach', 'perm'].includes(m));
            if (requiresCourse) {
                nextBtn.disabled = !appState.selectedCourse;
            } else {
                nextBtn.disabled = false; // それ以外は任意
            }
            break;
        case 3:
            nextBtn.disabled = !appState.selectedCare;
            break;
    }
}



// 次のステップへ
function nextStep() {
    const currentStep = appState.currentStep;

    if (currentStep >= 4) return;

    // Step 1からの遷移
    if (currentStep === 1) {
        // 縮毛矯正が選択されていたら詳細画面を表示
        if (appState.hasStraightening && !appState.showingStraighteningDetail) {
            showStraighteningDetail();
            return;
        }

        // クリームヘッドスパが選択されていたら詳細画面を表示
        if (appState.hasCreamSpa && !appState.showingCreamSpaDetail) {
            showCreamSpaDetail();
            return;
        }
    }

    // Step 2からの遷移
    if (currentStep === 2) {
        // プレミアムコースが選択されていて、縮毛矯正がない場合はトリートメント選択へ
        if (appState.selectedCourse === 'premium' && !appState.hasStraightening) {
            showTreatmentSelection();
            return;
        }

        updateCareStep();

        // コース未選択（任意の場合）はケア剤選択をスキップ
        if (!appState.selectedCourse) {
            appState.currentStep = 4;
            updateSummary();
            updateUI();
            return;
        }
    }

    // Step 3からの遷移
    if (currentStep === 3) {
        updateSummary();
    }

    appState.currentStep = currentStep + 1;
    updateUI();
}

// 前のステップへ
function prevStep() {
    if (appState.currentStep <= 1) return;

    // サマリー（Step 4）からの戻り
    if (appState.currentStep === 4) {
        if (appState.hasStraightening) {
            // 縮毛矯正がある場合はStep 1（詳細画面を閉じた状態）に戻る
            appState.currentStep = 1;
            appState.showingStraighteningDetail = false;
        } else if (!appState.selectedCourse) {
            // コース未選択（任意）でスキップした場合はStep 2に戻る
            appState.currentStep = 2;
        } else {
            // 通常はケア剤選択（Step 3）に戻る
            appState.currentStep = 3;
        }
    } else if (appState.currentStep === 3) {
        // ケア剤選択（Step 3）からの戻り
        if (appState.showingTreatmentSelection) {
            // トリートメント選択中の場合はトリートメント選択を解除してStep 2に戻る
            appState.showingTreatmentSelection = false;
            appState.currentStep = 2;
        } else {
            appState.currentStep = 2;
        }
    } else {
        appState.currentStep--;
    }

    updateUI();
}

// クリームヘッドスパ詳細画面を表示
function showCreamSpaDetail() {
    hideAllSteps();
    document.getElementById('stepCreamSpa').classList.add('active');
    appState.showingCreamSpaDetail = true;
}

// クリームヘッドスパ詳細画面を閉じる
function closeCreamSpaDetail() {
    document.getElementById('stepCreamSpa').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    appState.showingCreamSpaDetail = false;

    // クリームヘッドスパの選択を解除
    appState.hasCreamSpa = false;
    appState.selectedMenus = appState.selectedMenus.filter(m => m !== 'creamspa');
    document.querySelector('[data-menu="creamspa"]').classList.remove('selected');
}

// クリームヘッドスパを確定
function confirmCreamSpa() {
    appState.showingCreamSpaDetail = true;

    // 縮毛矯正も選択されている場合
    if (appState.hasStraightening && !appState.showingStraighteningDetail) {
        showStraighteningDetail();
        return;
    }

    // 縮毛矯正選択時はプレミアムを事前選択
    if (appState.hasStraightening) {
        preselectPremiumCourse();
    }

    appState.currentStep = 2;
    updateUI();
}

// 縮毛矯正詳細画面を表示
function showStraighteningDetail() {
    hideAllSteps();
    document.getElementById('stepStraightening').classList.add('active');
    appState.showingStraighteningDetail = true;
}

// 縮毛矯正詳細画面を閉じる
function closeStraighteningDetail() {
    document.getElementById('stepStraightening').classList.remove('active');

    // クリームヘッドスパが選択されていた場合はその画面に戻る
    if (appState.hasCreamSpa && appState.showingCreamSpaDetail) {
        document.getElementById('stepCreamSpa').classList.add('active');
    } else {
        document.getElementById('step1').classList.add('active');
    }

    appState.showingStraighteningDetail = false;

    // 縮毛矯正の選択を解除
    appState.hasStraightening = false;
    appState.selectedMenus = appState.selectedMenus.filter(m => m !== 'straightening');
    document.querySelector('[data-menu="straightening"]').classList.remove('selected');
}

// 縮毛矯正を確定（ベーシックコースを自動選択してコース選択・ケア剤をスキップ）
function confirmStraightening() {
    appState.showingStraighteningDetail = true;

    // ベーシックコースを自動選択
    appState.selectedCourse = 'basic';
    appState.autoSelectedCourse = true;
    const basicCard = document.querySelector('[data-course="basic"]');
    if (basicCard) {
        document.querySelectorAll('.course-card').forEach(c => c.classList.remove('selected'));
        basicCard.classList.add('selected');
    }

    // ケア剤ステップをスキップして直接サマリーへ
    appState.currentStep = 4;
    updateSummary();
    updateUI();
}

// トリートメント選択画面を表示
function showTreatmentSelection() {
    hideAllSteps();
    document.getElementById('stepTreatment').classList.add('active');
    appState.showingTreatmentSelection = true;
}

// トリートメント選択から戻る
function backFromTreatment() {
    document.getElementById('stepTreatment').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    appState.showingTreatmentSelection = false;
    appState.selectedTreatment = null;

    // 選択状態をリセット
    document.querySelectorAll('.treatment-card').forEach(c => c.classList.remove('selected'));
    const nextBtn = document.querySelector('#stepTreatment .next-btn');
    if (nextBtn) {
        nextBtn.disabled = true;
    }
}

// トリートメントを確定
function confirmTreatment() {
    updateCareStep();
    document.getElementById('stepTreatment').classList.remove('active');
    appState.currentStep = 3;
    updateUI();
}

// 全ステップを非表示
function hideAllSteps() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
}

// 縮毛矯正時にプレミアムコースを事前選択
function preselectPremiumCourse() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        if (card.dataset.course === 'premium') {
            card.classList.add('selected');
            appState.selectedCourse = 'premium';
        } else {
            card.classList.remove('selected');
            card.classList.add('disabled');
        }
    });
}

// ケア剤ステップの更新
function updateCareStep() {
    const course = appState.selectedCourse;
    const description = document.getElementById('careDescription');
    const keraforcePrice = document.getElementById('keraforcePrice');
    const angiePrice = document.getElementById('angiePrice');
    const nectarPrice = document.getElementById('nectarPrice');

    if (course === 'light') {
        description.textContent = 'お好みのケア剤をお選びください（+¥1,000）';
        keraforcePrice.textContent = '+¥1,000';
        angiePrice.textContent = '+¥1,000';
        nectarPrice.textContent = '+¥1,000';
    } else {
        description.textContent = 'お好みのケア剤をお選びください（コース料金に含まれます）';
        keraforcePrice.textContent = '¥0（込）';
        angiePrice.textContent = '¥0（込）';
        nectarPrice.textContent = '¥0（込）';
    }
}

// サマリーの更新
function updateSummary() {
    const menuList = document.getElementById('summaryMenus');
    const courseElement = document.getElementById('summaryCourse');
    const careSection = document.getElementById('summaryCareSection');
    const careElement = document.getElementById('summaryCare');
    const treatmentSection = document.getElementById('summaryTreatmentSection');
    const treatmentElement = document.getElementById('summaryTreatment');
    const nominationElement = document.getElementById('summaryNomination');
    const totalElement = document.getElementById('totalPrice');

    // メニューリストを作成
    menuList.innerHTML = '';
    let menuTotal = 0;

    appState.selectedMenus.forEach(menu => {
        const li = document.createElement('li');
        let price = 0;

        if (menu === 'bleach') {
            price = appState.bleachPrice;
        } else {
            price = PRICES.menus[menu];
        }

        menuTotal += price;
        li.innerHTML = `<span>${MENU_NAMES[menu]}</span><span>¥${price.toLocaleString()}</span>`;
        menuList.appendChild(li);
    });

    // コース
    if (appState.selectedCourse) {
        const coursePrice = PRICES.courses[appState.selectedCourse];
        courseElement.innerHTML = `<span>${COURSE_NAMES[appState.selectedCourse]}</span><span>+¥${coursePrice.toLocaleString()}</span>`;
    } else {
        courseElement.innerHTML = `<span>なし</span><span>¥0</span>`;
    }

    // トリートメント（プレミアムで縮毛矯正なしの場合）
    if (appState.selectedTreatment && !appState.hasStraightening) {
        treatmentSection.style.display = 'block';
        treatmentElement.innerHTML = `<span>${TREATMENT_NAMES[appState.selectedTreatment]}</span><span>¥0（込）</span>`;
    } else {
        treatmentSection.style.display = 'none';
    }

    // ケア剤（縮毛矯正の場合は非表示）
    if (appState.hasStraightening) {
        careSection.style.display = 'none';
    } else {
        careSection.style.display = 'block';
        let carePrice = 0;
        if (appState.selectedCourse === 'light') {
            carePrice = PRICES.care[appState.selectedCare];
        }
        const carePriceText = carePrice > 0 ? `+¥${carePrice.toLocaleString()}` : '¥0（込）';
        careElement.innerHTML = `<span>${CARE_NAMES[appState.selectedCare]}</span><span>${carePriceText}</span>`;
    }

    // 指名料
    const nominationPrice = appState.nomination ? PRICES.nomination : 0;
    const nominationText = appState.nomination ? 'あり' : 'なし';
    nominationElement.innerHTML = `<span>${nominationText}</span><span>${nominationPrice > 0 ? '+¥' + nominationPrice.toLocaleString() : '¥0'}</span>`;

    // 合計計算
    let total = menuTotal + nominationPrice;

    if (appState.selectedCourse) {
        total += PRICES.courses[appState.selectedCourse];
    }

    // ライトコースの場合のみケア剤料金を追加
    if (!appState.hasStraightening && appState.selectedCourse === 'light' && appState.selectedCare) {
        total += PRICES.care[appState.selectedCare];
    }

    totalElement.textContent = `¥${total.toLocaleString()}`;
}

// UI更新
function updateUI() {
    // ステップの表示を更新
    hideAllSteps();
    document.getElementById(`step${appState.currentStep}`).classList.add('active');

    // プログレスバーの更新
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === appState.currentStep) {
            step.classList.add('active');
        } else if (stepNum < appState.currentStep) {
            step.classList.add('completed');
        }
    });

    // コースカードの無効化をリセット（Step 2に戻った時）
    if (appState.currentStep === 2 && !appState.hasStraightening) {
        document.querySelectorAll('.course-card').forEach(card => {
            card.classList.remove('disabled');
        });
    }

    // ボタン状態を更新
    updateNextButton();
}


// アプリをリセット
function resetApp() {
    // 状態をリセット
    appState.currentStep = 1;
    appState.nomination = null;
    appState.selectedMenus = [];
    appState.bleachPrice = 4000;
    appState.selectedCourse = null;
    appState.selectedCare = null;
    appState.selectedTreatment = null;
    appState.hasStraightening = false;
    appState.hasCreamSpa = false;
    appState.showingCreamSpaDetail = false;
    appState.showingStraighteningDetail = false;
    appState.showingTreatmentSelection = false;

    // UIをリセット
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.disabled').forEach(el => el.classList.remove('disabled'));

    // チェックボックスをリセット
    const spaCheckbox = document.getElementById('spaCheckbox');
    if (spaCheckbox) {
        spaCheckbox.checked = false;
    }

    // 指名料ラジオボタンをリセット
    const nominationRadios = document.querySelectorAll('input[name="nomination"]');
    nominationRadios.forEach(radio => {
        radio.checked = radio.value === 'false';
    });
    appState.nomination = false;

    // ブリーチスライダーをリセット
    const slider = document.querySelector('.bleach-slider');
    const valueDisplay = document.querySelector('.bleach-value');
    if (slider) {
        slider.value = 4000;
        valueDisplay.textContent = '¥4,000';
        document.querySelector('.bleach-slider-container').style.display = 'none';
    }

    // トリートメント選択をリセット
    document.querySelectorAll('.treatment-card').forEach(c => c.classList.remove('selected'));
    const treatmentNextBtn = document.querySelector('#stepTreatment .next-btn');
    if (treatmentNextBtn) {
        treatmentNextBtn.disabled = true;
    }

    // UIを更新
    updateUI();
}
