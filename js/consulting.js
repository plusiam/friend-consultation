// 컨설팅 화면 관리 모듈
import { state } from './data.js';
import { showElement, hideElement, scrollToElement } from './utils.js';
import { updateCardPreview } from './card-maker.js';

// 새로운 고민 사례 로드
export function loadNewCase() {
    console.log('새로운 고민 사례 로드');
    const randomIndex = Math.floor(Math.random() * state.data.worryDatabase.length);
    state.currentCase = state.data.worryDatabase[randomIndex];
    
    document.getElementById('case-title').textContent = state.currentCase.title;
    document.getElementById('case-content').textContent = state.currentCase.content;
    
    scrollToElement('case-display');
}

// 컨설팅 시작
export function startConsulting() {
    const grade = document.getElementById('grade').value || '?';
    const className = document.getElementById('class').value || '?';
    const name = document.getElementById('name').value || '익명';
    
    state.currentStudent = { grade, class: className, name };
    console.log('학생 정보:', state.currentStudent);
    
    hideElement('start-screen');
    showElement('consulting-screen');
    loadNewCase();
}

// 3단계로 이동
export function moveToCardMaking() {
    const empathy = document.getElementById('empathy').value.trim();
    const suggestion = document.getElementById('suggestion').value.trim();
    
    if (!empathy && !suggestion) {
        alert('1단계(공감)와 2단계(제안) 중 적어도 하나는 작성해주세요.');
        return;
    }
    
    state.consultingData = { 
        empathy: empathy || '작성하지 않음', 
        suggestion: suggestion || '작성하지 않음' 
    };
    
    hideElement('consulting-screen');
    showElement('card-making-screen');
    
    document.getElementById('card-to').value = '고민 상담자';
    document.getElementById('card-from').value = state.currentStudent.name || '나';
    
    updateCardPreview();
}

// 컨설팅으로 돌아가기
export function backToConsulting() {
    hideElement('card-making-screen');
    showElement('consulting-screen');
    
    if (state.consultingData.empathy && state.consultingData.empathy !== '작성하지 않음') {
        document.getElementById('empathy').value = state.consultingData.empathy;
    }
    if (state.consultingData.suggestion && state.consultingData.suggestion !== '작성하지 않음') {
        document.getElementById('suggestion').value = state.consultingData.suggestion;
    }
}

// 새로운 사례 도전 (카드 화면에서)
export function newCaseFromCard() {
    hideElement('card-making-screen');
    showElement('consulting-screen');
    loadNewCase();
    
    document.getElementById('empathy').value = '';
    document.getElementById('suggestion').value = '';
    state.consultingData = { empathy: '', suggestion: '' };
    state.selectedMessages = [];
    updateSelectedMessages();
}

// 선택된 메시지 업데이트
export function updateSelectedMessages() {
    const container = document.getElementById('selected-messages');
    container.innerHTML = '';
    
    state.selectedMessages.forEach((message, index) => {
        const messageEl = document.createElement('div');
        messageEl.className = 'flex items-center justify-between p-2 bg-purple-50 rounded text-sm';
        messageEl.innerHTML = `
            <span class="flex-1">${message}</span>
            <button class="remove-message text-red-500 hover:text-red-700 ml-2" data-index="${index}">×</button>
        `;
        container.appendChild(messageEl);
    });
    
    container.querySelectorAll('.remove-message').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            state.selectedMessages.splice(index, 1);
            updateSelectedMessages();
            updateCardPreview();
        });
    });
}