// initEmotionButtons 함수에 추가할 내용
export function initEmotionButtons() {
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const selectedEmotionsDiv = document.getElementById('selected-emotions');
    const customEmotionInput = document.getElementById('custom-emotion-input');
    const addCustomEmotionBtn = document.getElementById('add-custom-emotion-btn');
    
    // selectedEmotions를 전역으로 관리하기 위해 state에 추가
    if (!state.selectedEmotions) {
        state.selectedEmotions = [];
    }
    
    // 기본 감정 버튼 이벤트
    emotionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const emotionText = btn.textContent;
            
            if (btn.classList.contains('selected')) {
                btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
                btn.classList.add('border-gray-300');
                state.selectedEmotions = state.selectedEmotions.filter(e => e !== emotionText);
            } else {
                btn.classList.add('selected', 'bg-green-100', 'border-green-500');
                btn.classList.remove('border-gray-300');
                if (!state.selectedEmotions.includes(emotionText)) {
                    state.selectedEmotions.push(emotionText);
                }
            }
            
            updateSelectedEmotionsDisplay();
        });
    });
    
    // 직접 입력한 감정 추가
    if (addCustomEmotionBtn) {
        addCustomEmotionBtn.addEventListener('click', addCustomEmotion);
    }
    
    // Enter 키로도 추가 가능
    if (customEmotionInput) {
        customEmotionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomEmotion();
            }
        });
    }
}

// 커스텀 감정 추가 함수
function addCustomEmotion() {
    const customEmotionInput = document.getElementById('custom-emotion-input');
    const customEmotion = customEmotionInput.value.trim();
    
    if (customEmotion && !state.selectedEmotions.some(e => e.includes(customEmotion))) {
        state.selectedEmotions.push(`✨ ${customEmotion}`);
        updateSelectedEmotionsDisplay();
        customEmotionInput.value = '';
    }
}

// 선택된 감정 표시 업데이트
function updateSelectedEmotionsDisplay() {
    const selectedEmotionsDiv = document.getElementById('selected-emotions');
    
    if (state.selectedEmotions.length > 0) {
        selectedEmotionsDiv.innerHTML = `
            <div class="flex flex-wrap gap-2 mt-2">
                <span class="font-semibold">선택한 감정:</span>
                ${state.selectedEmotions.map((emotion, index) => 
                    `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${emotion}
                        <button type="button" class="ml-1 text-green-600 hover:text-green-900" onclick="window.removeEmotion(${index})">×</button>
                    </span>`
                ).join('')}
            </div>
        `;
    } else {
        selectedEmotionsDiv.innerHTML = '';
    }
}

// 전역 함수로 removeEmotion 등록
window.removeEmotion = (index) => {
    const emotion = state.selectedEmotions[index];
    
    // 기본 감정 버튼에서 선택 해제
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        if (btn.textContent === emotion) {
            btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
            btn.classList.add('border-gray-300');
        }
    });
    
    // 배열에서 제거
    state.selectedEmotions.splice(index, 1);
    updateSelectedEmotionsDisplay();
};
