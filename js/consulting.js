// 컨설팅 화면 관리 모듈
import { state } from './data.js';
import { showElement, hideElement, scrollToElement } from './utils.js';
import { updateCardPreview } from './card-maker.js';

// 감정 버튼 이벤트 처리
export function initEmotionButtons() {
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const selectedEmotionsDiv = document.getElementById('selected-emotions');
    const customEmotionInput = document.getElementById('custom-emotion-input');
    const addCustomEmotionBtn = document.getElementById('add-custom-emotion-btn');
    let selectedEmotions = [];
    
    // 감정 버튼 클릭 이벤트
    emotionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const emotion = btn.dataset.emotion;
            const emotionText = btn.textContent;
            
            if (btn.classList.contains('selected')) {
                // 선택 해제
                btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
                btn.classList.add('border-gray-300');
                selectedEmotions = selectedEmotions.filter(e => e !== emotionText);
            } else {
                // 선택
                btn.classList.add('selected', 'bg-green-100', 'border-green-500');
                btn.classList.remove('border-gray-300');
                if (!selectedEmotions.includes(emotionText)) {
                    selectedEmotions.push(emotionText);
                }
            }
            
            updateSelectedEmotions(selectedEmotions, selectedEmotionsDiv);
        });
    });
    
    // 커스텀 감정 추가 함수
    const addCustomEmotion = () => {
        const customEmotion = customEmotionInput.value.trim();
        if (customEmotion && !selectedEmotions.includes(customEmotion)) {
            selectedEmotions.push(customEmotion);
            updateSelectedEmotions(selectedEmotions, selectedEmotionsDiv);
            customEmotionInput.value = '';
        }
    };
    
    // 추가 버튼 클릭 이벤트
    addCustomEmotionBtn.addEventListener('click', addCustomEmotion);
    
    // Enter 키 입력 이벤트
    customEmotionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomEmotion();
        }
    });
    
    // 선택된 감정 목록을 state에 저장
    state.selectedEmotions = selectedEmotions;
}

// 선택된 감정 표시 업데이트
function updateSelectedEmotions(emotions, displayDiv) {
    if (emotions.length > 0) {
        displayDiv.innerHTML = `
            <div class="flex flex-wrap gap-2 mt-2">
                ${emotions.map((emotion, index) => `
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${emotion}
                        <button type="button" class="ml-2 text-green-600 hover:text-green-800" onclick="removeEmotion(${index})">×</button>
                    </span>
                `).join('')}
            </div>
        `;
    } else {
        displayDiv.innerHTML = '';
    }
    
    // state 업데이트
    state.selectedEmotions = emotions;
}

// 전역 함수로 감정 제거 기능 추가
window.removeEmotion = function(index) {
    const selectedEmotionsDiv = document.getElementById('selected-emotions');
    const emotions = state.selectedEmotions || [];
    
    // 배열에서 제거
    const removedEmotion = emotions.splice(index, 1)[0];
    
    // 버튼 상태 업데이트 (미리 정의된 감정인 경우)
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        if (btn.textContent === removedEmotion) {
            btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
            btn.classList.add('border-gray-300');
        }
    });
    
    updateSelectedEmotions(emotions, selectedEmotionsDiv);
};

// 체크리스트 이벤트 처리
export function initSuggestionChecklist() {
    const checkboxes = document.querySelectorAll('.suggestion-check');
    const reminder = document.getElementById('checklist-reminder');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            if (allChecked) {
                reminder.classList.add('hidden');
            } else {
                reminder.classList.remove('hidden');
            }
        });
    });
}

// 새로운 고민 사례 로드
export function loadNewCase() {
    console.log('새로운 고민 사례 로드');
    const randomIndex = Math.floor(Math.random() * state.data.worryDatabase.length);
    state.currentCase = state.data.worryDatabase[randomIndex];
    
    document.getElementById('case-title').textContent = state.currentCase.title;
    document.getElementById('case-content').textContent = state.currentCase.content;
    
    // 감정 버튼 초기화
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
        btn.classList.add('border-gray-300');
    });
    document.getElementById('selected-emotions').innerHTML = '';
    document.getElementById('custom-emotion-input').value = '';
    state.selectedEmotions = [];
    
    // 체크박스 초기화
    document.querySelectorAll('.suggestion-check').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('checklist-reminder').classList.remove('hidden');
    
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
    const checkboxes = document.querySelectorAll('.suggestion-check');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (!empathy && !suggestion) {
        alert('1단계(공감)와 2단계(제안) 중 적어도 하나는 작성해주세요.');
        return;
    }
    
    if (!allChecked) {
        const confirmMove = confirm('아직 체크하지 않은 항목이 있습니다. 그래도 계속하시겠습니까?');
        if (!confirmMove) return;
    }
    
    state.consultingData = { 
        empathy: empathy || '작성하지 않음', 
        suggestion: suggestion || '작성하지 않음',
        selectedEmotions: state.selectedEmotions || []
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
    state.selectedEmotions = [];
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