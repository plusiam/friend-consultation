// 유틸리티 함수들

// 템플릿별 그라디언트 가져오기
export function getTemplateGradient(template) {
    const gradients = {
        pastel: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
        nature: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
        sky: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #a855f7 100%)',
        sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        forest: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 50%, #093637 100%)'
    };
    return gradients[template] || gradients.pastel;
}

// 텍스트 색상 가져오기
export function getTextColorClass(colorName) {
    const colors = {
        white: '#ffffff',
        cream: '#fef7ed', 
        'light-blue': '#dbeafe',
        'light-pink': '#fce7f3',
        'light-green': '#d1fae5'
    };
    return colors[colorName] || colors.white;
}

// 현재 날짜 문자열 가져오기
export function getCurrentDateString() {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
}

// 요소 표시/숨기기
export function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('screen-transition');
    }
}

export function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// 스크롤 애니메이션
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// 버튼 로딩 상태 관리
export function setButtonLoading(buttonId, isLoading, loadingText = '처리 중...') {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = loadingText;
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
    }
}

// 디바운스 함수
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}