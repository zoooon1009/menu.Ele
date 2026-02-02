// ========================================
// Eleanor spa&treatment - カウンセリングアプリ
// Main Application Logic
// ========================================

// State Management
const state = {
    currentStep: 1,
    selectedMenus: [],
    selectedCourse: null,
    selectedTreatment: null,
    selectedCare: null,
    hasNomination: false,
    menuPrices: {},
    showingStraighteningDetail: false,
    showingCreamSpaDetail: false
};

// Menu name mappings
const menuNames = {
    cut: 'カット',
    color: 'カラー',
    bleach: 'ブリーチ',
    straightening: '縮毛矯正',
    perm: 'パーマ',
    creamspa: 'クリームヘッドスパ',
    eyebrow: '眉カット',
    bangs: '前髪カット',
    spa: 'スパシャンプー&ブロー'
};

const courseNames = {
    light: 'ライトコース',
    basic: 'ベーシックコース',
    premium: 'プレミアムコース'
};

const treatmentNames = {
    alkali: 'アルカリ酸熱トリートメント',
    acid: '酸熱トリートメント'
};

const careNames = {
    keraforce: 'ケラフォース',
    angie: 'アンジー',
    nectar: 'ネクター'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateProgressBar();
});

function initializeEventListeners() {
    // Menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => handleMenuSelection(card));
    });

    // Option checkboxes
    document.querySelectorAll('.option-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', () => handleOptionChange(checkbox));
    });

    // Course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => handleCourseSelection(card));
    });

    // Treatment cards
    document.querySelectorAll('.treatment-card').forEach(card => {
        card.addEventListener('click', () => handleTreatmentSelection(card));
    });

    // Care cards
    document.querySelectorAll('.care-card').forEach(card => {
        card.addEventListener('click', () => handleCareSelection(card));
    });

    // Nomination radios
    document.querySelectorAll('input[name="nomination"]').forEach(radio => {
        radio.addEventListener('change', () => {
            state.hasNomination = radio.value === 'true';
        });
    });

    // Price sliders
    document.querySelectorAll('.price-slider').forEach(slider => {
        slider.addEventListener('input', (e) => handlePriceSlider(e));
    });
}

function handleMenuSelection(card) {
    const menu = card.dataset.menu;
    const basePrice = parseInt(card.dataset.price);
    const hasPriceRange = card.dataset.priceRange === 'true';

    // Special handling for straightening
    if (menu === 'straightening') {
        if (!card.classList.contains('selected')) {
            card.classList.add('selected');
            state.menuPrices[menu] = basePrice;
            if (!state.selectedMenus.includes(menu)) {
                state.selectedMenus.push(menu);
            }
            showStraighteningDetail();
        } else {
            card.classList.remove('selected');
            state.selectedMenus = state.selectedMenus.filter(m => m !== menu);
            delete state.menuPrices[menu];
        }
        updatePriceDisplay(card, menu);
        updateStep1NextButton();
        return;
    }

    // Special handling for cream spa
    if (menu === 'creamspa') {
        if (!card.classList.contains('selected')) {
            card.classList.add('selected');
            state.menuPrices[menu] = basePrice;
            if (!state.selectedMenus.includes(menu)) {
                state.selectedMenus.push(menu);
            }
            showCreamSpaDetail();
        } else {
            card.classList.remove('selected');
            state.selectedMenus = state.selectedMenus.filter(m => m !== menu);
            delete state.menuPrices[menu];
        }
        updateStep1NextButton();
        return;
    }

    // Toggle selection
    card.classList.toggle('selected');

    if (card.classList.contains('selected')) {
        state.menuPrices[menu] = basePrice;
        if (!state.selectedMenus.includes(menu)) {
            state.selectedMenus.push(menu);
        }
        if (hasPriceRange) {
            card.querySelector('.price-slider-container').style.display = 'block';
        }
    } else {
        state.selectedMenus = state.selectedMenus.filter(m => m !== menu);
        delete state.menuPrices[menu];
        if (hasPriceRange) {
            card.querySelector('.price-slider-container').style.display = 'none';
        }
    }

    updateStep1NextButton();
}

function handlePriceSlider(e) {
    const target = e.target.dataset.target;
    const value = parseInt(e.target.value);
    state.menuPrices[target] = value;

    const card = document.querySelector(`.menu-card[data-menu="${target}"]`);
    updatePriceDisplay(card, target);
}

function updatePriceDisplay(card, menu) {
    const priceEl = card.querySelector('.menu-price');
    const price = state.menuPrices[menu] || parseInt(card.dataset.price);
    priceEl.textContent = `¥${price.toLocaleString()}`;
}

function handleOptionChange(checkbox) {
    const menu = checkbox.dataset.menu;
    const price = parseInt(checkbox.dataset.price);

    if (checkbox.checked) {
        if (!state.selectedMenus.includes(menu)) {
            state.selectedMenus.push(menu);
            state.menuPrices[menu] = price;
        }
    } else {
        state.selectedMenus = state.selectedMenus.filter(m => m !== menu);
        delete state.menuPrices[menu];
    }

    updateStep1NextButton();
}

function updateStep1NextButton() {
    const nextBtn = document.querySelector('#step1 .next-btn');
    nextBtn.disabled = state.selectedMenus.length === 0;
}

// Straightening Detail
function showStraighteningDetail() {
    state.showingStraighteningDetail = true;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('stepStraightening').classList.add('active');
}

function closeStraighteningDetail() {
    state.showingStraighteningDetail = false;
    const card = document.querySelector('.menu-card[data-menu="straightening"]');
    card.classList.remove('selected');
    state.selectedMenus = state.selectedMenus.filter(m => m !== 'straightening');
    delete state.menuPrices['straightening'];

    document.getElementById('stepStraightening').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    updateStep1NextButton();
}

function confirmStraightening() {
    state.showingStraighteningDetail = false;
    document.getElementById('stepStraightening').classList.remove('active');
    document.getElementById('step1').classList.add('active');

    const card = document.querySelector('.menu-card[data-menu="straightening"]');
    const sliderContainer = card.querySelector('.price-slider-container');
    if (sliderContainer) {
        sliderContainer.style.display = 'block';
    }
    updateStep1NextButton();
}

// Cream Spa Detail
function showCreamSpaDetail() {
    state.showingCreamSpaDetail = true;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('stepCreamSpa').classList.add('active');
}

function closeCreamSpaDetail() {
    state.showingCreamSpaDetail = false;
    const card = document.querySelector('.menu-card[data-menu="creamspa"]');
    card.classList.remove('selected');
    state.selectedMenus = state.selectedMenus.filter(m => m !== 'creamspa');
    delete state.menuPrices['creamspa'];

    document.getElementById('stepCreamSpa').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    updateStep1NextButton();
}

function confirmCreamSpa() {
    state.showingCreamSpaDetail = false;
    document.getElementById('stepCreamSpa').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    updateStep1NextButton();
}

// Course Selection
function handleCourseSelection(card) {
    document.querySelectorAll('.course-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    state.selectedCourse = {
        type: card.dataset.course,
        price: parseInt(card.dataset.price)
    };
}

// Treatment Selection
function handleTreatmentSelection(card) {
    document.querySelectorAll('.treatment-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    state.selectedTreatment = card.dataset.treatment;

    document.querySelector('#stepTreatment .next-btn').disabled = false;
}

function backFromTreatment() {
    document.getElementById('stepTreatment').classList.remove('active');
    document.getElementById('step2').classList.add('active');
}

function confirmTreatment() {
    document.getElementById('stepTreatment').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    state.currentStep = 3;
    updateProgressBar();
    updateCarePrices();
}

// Care Selection
function handleCareSelection(card) {
    document.querySelectorAll('.care-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    state.selectedCare = card.dataset.care;

    document.querySelector('#step3 .next-btn').disabled = false;
}

function updateCarePrices() {
    const baseCarePrice = state.selectedCourse?.type === 'light' ? 1100 : 0;
    const description = document.getElementById('careDescription');

    if (baseCarePrice === 0) {
        description.textContent = 'ケア剤は無料でお選びいただけます';
    } else {
        description.textContent = 'お好みのケア剤をお選びください（+¥1,100）';
    }

    document.getElementById('keraforcePrice').textContent = `¥${baseCarePrice.toLocaleString()}`;
    document.getElementById('angiePrice').textContent = `¥${baseCarePrice.toLocaleString()}`;
    document.getElementById('nectarPrice').textContent = `¥${baseCarePrice.toLocaleString()}`;
}

// Navigation
function nextStep() {
    if (state.currentStep === 1) {
        state.currentStep = 2;
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
    } else if (state.currentStep === 2) {
        if (state.selectedCourse?.type === 'premium' && !state.selectedMenus.includes('straightening')) {
            // Show treatment selection for premium without straightening
            document.getElementById('step2').classList.remove('active');
            document.getElementById('stepTreatment').classList.add('active');
        } else {
            state.currentStep = 3;
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            updateCarePrices();
        }
    } else if (state.currentStep === 3) {
        state.currentStep = 4;
        document.getElementById('step3').classList.remove('active');
        document.getElementById('step4').classList.add('active');
        updateSummary();
    }

    updateProgressBar();
}

function prevStep() {
    if (state.currentStep === 2) {
        state.currentStep = 1;
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step1').classList.add('active');
    } else if (state.currentStep === 3) {
        if (state.selectedCourse?.type === 'premium' && !state.selectedMenus.includes('straightening')) {
            document.getElementById('step3').classList.remove('active');
            document.getElementById('stepTreatment').classList.add('active');
        } else {
            state.currentStep = 2;
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step2').classList.add('active');
        }
    } else if (state.currentStep === 4) {
        state.currentStep = 3;
        document.getElementById('step4').classList.remove('active');
        document.getElementById('step3').classList.add('active');
    }

    updateProgressBar();
}

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === state.currentStep) {
            step.classList.add('active');
        } else if (stepNum < state.currentStep) {
            step.classList.add('completed');
        }
    });

    document.querySelectorAll('.progress-line').forEach((line, index) => {
        line.classList.remove('active');
        if (index + 1 < state.currentStep) {
            line.classList.add('active');
        }
    });
}

function updateSummary() {
    // Menus
    const menusList = document.getElementById('summaryMenus');
    menusList.innerHTML = '';

    state.selectedMenus.forEach(menu => {
        const li = document.createElement('li');
        const name = menuNames[menu] || menu;
        const price = state.menuPrices[menu] || 0;
        li.innerHTML = `<span>${name}</span><span>¥${price.toLocaleString()}</span>`;
        menusList.appendChild(li);
    });

    // Course
    const courseEl = document.getElementById('summaryCourse');
    if (state.selectedCourse) {
        const courseName = courseNames[state.selectedCourse.type];
        courseEl.textContent = `${courseName} - ¥${state.selectedCourse.price.toLocaleString()}`;
    }

    // Treatment
    const treatmentSection = document.getElementById('summaryTreatmentSection');
    if (state.selectedTreatment) {
        treatmentSection.style.display = 'block';
        document.getElementById('summaryTreatment').textContent = treatmentNames[state.selectedTreatment];
    } else if (state.selectedMenus.includes('straightening')) {
        treatmentSection.style.display = 'block';
        document.getElementById('summaryTreatment').textContent = '縮毛矯正（プレミアム適用）';
    } else {
        treatmentSection.style.display = 'none';
    }

    // Care
    const careEl = document.getElementById('summaryCare');
    if (state.selectedCare) {
        const careName = careNames[state.selectedCare];
        const carePrice = state.selectedCourse?.type === 'light' ? 1100 : 0;
        careEl.textContent = carePrice > 0 ? `${careName} - ¥${carePrice.toLocaleString()}` : `${careName} - 無料`;
    }

    // Nomination
    const nominationSection = document.getElementById('summaryNominationSection');
    const nominationEl = document.getElementById('summaryNomination');
    if (state.hasNomination) {
        nominationSection.style.display = 'block';
        nominationEl.textContent = '¥550';
    } else {
        nominationSection.style.display = 'none';
    }

    // Total
    let total = 0;

    // Menu prices
    Object.values(state.menuPrices).forEach(price => {
        total += price;
    });

    // Course price
    if (state.selectedCourse) {
        total += state.selectedCourse.price;
    }

    // Care price (only for light course)
    if (state.selectedCourse?.type === 'light' && state.selectedCare) {
        total += 1100;
    }

    // Nomination fee
    if (state.hasNomination) {
        total += 550;
    }

    document.getElementById('totalPrice').textContent = `¥${total.toLocaleString()}`;
}

function resetApp() {
    // Reset state
    state.currentStep = 1;
    state.selectedMenus = [];
    state.selectedCourse = null;
    state.selectedTreatment = null;
    state.selectedCare = null;
    state.hasNomination = false;
    state.menuPrices = {};
    state.showingStraighteningDetail = false;
    state.showingCreamSpaDetail = false;

    // Reset UI
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.price-slider-container').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.option-checkbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="nomination"]').forEach(radio => {
        radio.checked = radio.value === 'false';
    });

    // Reset price sliders
    document.querySelectorAll('.price-slider').forEach(slider => {
        const card = slider.closest('.menu-card');
        slider.value = card.dataset.price;
        const priceEl = card.querySelector('.menu-price');
        priceEl.textContent = `¥${parseInt(card.dataset.price).toLocaleString()}`;
    });

    // Show step 1
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');

    // Update UI
    updateProgressBar();
    updateStep1NextButton();
}
