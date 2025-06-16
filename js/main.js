// 메인 애플리케이션 엔트리 포인트
import { loadData, state, resetState } from './data.js';
import { showElement, hideElement, getCurrentDateString, setButtonLoading } from './utils.js';
import { 
    startConsulting, 
    loadNewCase, 
    moveToCardMaking, 
    backToConsulting,
    newCaseFromCard,
    updateSelectedMessages,
    initEmotionButtons,
    initSuggestionChecklist
} from './consulting.js';
import { 
    drawEncouragementMessage, 
    addEncouragementMessage,
    handleBackgroundUpload,
    removeBackgroundImage,
    selectTemplate,
    selectTextColor,
    updateCardPreview,
    downloadCardImage
} from './card-maker.js';

// 디버깅을 위한 초기 로그
console.log('=== 스크립트 로드 시작 ===');

// ===== 초기화 함수 =====
async function initializeApp() {
    console.log('=== 앱 초기화 시작 ===');
    
    try {
        // 데이터 로드
        const data = await loadData();
        state.data = data;
        console.log('데이터 로드 완료:', { 
            worries: data.worryDatabase.length, 
            encouragements: data.encouragementMessages.length 
        });
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 새로운 기능 초기화
        initEmotionButtons();
        initSuggestionChecklist();
        
        console.log('=== 앱 초기화 완료 ===');
        
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        alert('애플리케이션 초기화 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    console.log('이벤트 리스너 설정 시작');
    
    // 시작 화면
    document.getElementById('start-consulting-btn')?.addEventListener('click', startConsulting);
    
    // 컨설팅 화면
    document.getElementById('new-case-btn')?.addEventListener('click', loadNewCase);
    document.getElementById('next-to-card-btn')?.addEventListener('click', moveToCardMaking);
    
    // 카드 제작 화면
    document.getElementById('draw-message-btn')?.addEventListener('click', drawEncouragementMessage);
    document.getElementById('add-message-btn')?.addEventListener('click', addEncouragementMessage);
    document.getElementById('upload-background-btn')?.addEventListener('click', () => {
        document.getElementById('background-upload').click();
    });
    document.getElementById('background-upload')?.addEventListener('change', handleBackgroundUpload);
    document.getElementById('remove-background-btn')?.addEventListener('click', removeBackgroundImage);
    
    // 템플릿 선택
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', selectTemplate);
    });
    
    // 글자색 선택
    document.querySelectorAll('.text-color-btn').forEach(btn => {
        btn.addEventListener('click', selectTextColor);
    });
    
    // 입력 필드 이벤트
    ['card-to', 'card-from', 'custom-message'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateCardPreview);
    });
    
    // 카드 액션 버튼들
    document.getElementById('download-card-btn')?.addEventListener('click', downloadCardImage);
    document.getElementById('back-to-consulting-btn')?.addEventListener('click', backToConsulting);
    document.getElementById('complete-card-btn')?.addEventListener('click', showFinalResult);
    document.getElementById('new-case-from-card-btn')?.addEventListener('click', newCaseFromCard);
    
    // 결과 화면 버튼들
    document.getElementById('download-image-btn')?.addEventListener('click', downloadReportAsImage);
    document.getElementById('download-pdf-btn')?.addEventListener('click', downloadReportAsPDF);
    document.getElementById('new-challenge-btn')?.addEventListener('click', newChallengeFromResult);
    document.getElementById('restart-btn')?.addEventListener('click', restartApp);
    
    console.log('이벤트 리스너 설정 완료');
}

// ===== 최종 결과 표시 =====
function showFinalResult() {
    console.log('최종 결과 표시');
    
    if (!state.currentCase) {
        alert('고민 사례를 먼저 선택해주세요.');
        return;
    }
    
    if (!state.consultingData || 
        (!state.consultingData.empathy || state.consultingData.empathy === '' || state.consultingData.empathy === '작성하지 않음') && 
        (!state.consultingData.suggestion || state.consultingData.suggestion === '' || state.consultingData.suggestion === '작성하지 않음')) {
        alert('1단계(공감)나 2단계(제안) 중 적어도 하나는 작성해주세요.');
        return;
    }
    
    try {
        const cardData = {
            to: document.getElementById('card-to').value || '친구',
            from: document.getElementById('card-from').value || '나',
            messages: state.selectedMessages,
            customMessage: document.getElementById('custom-message').value,
            template: state.currentTemplate
        };
        
        const dateString = getCurrentDateString();
        
        const empathyText = state.consultingData.empathy && state.consultingData.empathy !== '작성하지 않음' ? 
            state.consultingData.empathy : '(작성되지 않음)';
        const suggestionText = state.consultingData.suggestion && state.consultingData.suggestion !== '작성하지 않음' ? 
            state.consultingData.suggestion : '(작성되지 않음)';
        
        const resultContent = generateResultHTML({
            student: state.currentStudent,
            dateString,
            currentCase: state.currentCase,
            empathyText,
            suggestionText,
            cardData
        });
        
        document.getElementById('result-content').innerHTML = resultContent;
        
        hideElement('card-making-screen');
        showElement('result-screen');
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('보고서 생성 중 오류:', error);
        alert('보고서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 결과 HTML 생성
function generateResultHTML({ student, dateString, currentCase, empathyText, suggestionText, cardData }) {
    return `
        <div class="border-b-2 pb-4 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">컨설턴트 정보</p>
                    <p class="text-xl font-bold text-green-700">${student.grade}학년 ${student.class}반 ${student.name}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">작성일</p>
                    <p class="font-medium">${dateString}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-3">📋 접수된 고민 사례</h3>
            <div class="bg-white p-4 rounded-lg border-l-4 border-orange-400">
                <h4 class="font-bold text-lg text-gray-700 mb-2">${currentCase.title}</h4>
                <p class="text-gray-700 leading-relaxed">${currentCase.content}</p>
            </div>
        </div>
        
        <div class="space-y-6">
            <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 class="text-xl font-bold text-green-700 mb-3">💚 [1단계] 마음 공감하기</h3>
                <div class="bg-white p-4 rounded-lg">
                    <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">${empathyText}</p>
                </div>
            </div>
            
            <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 class="text-xl font-bold text-blue-700 mb-3">🎯 [2단계] 도움 제안하기</h3>
                <div class="bg-white p-4 rounded-lg">
                    <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">${suggestionText}</p>
                </div>
            </div>
            
            <div class="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 class="text-xl font-bold text-purple-700 mb-3">🎁 [3단계] 격려 카드</h3>
                ${generateCardResultHTML(cardData)}
            </div>
        </div>
        
        <div class="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center border-2 border-green-200">
            <h3 class="text-xl font-bold text-green-800 mb-2">🌟 컨설팅 완료 🌟</h3>
            <p class="text-green-700 font-medium">3단계 컨설팅을 완주한 <span class="font-bold text-green-800">${student.name}</span>님, 정말 수고하셨습니다!</p>
            <p class="text-sm text-gray-600 mt-2">따뜻한 마음으로 친구를 도와준 당신의 노력이 아름답습니다.</p>
        </div>
    `;
}

// 카드 결과 HTML 생성
function generateCardResultHTML(cardData) {
    const { getTemplateGradient } = utils;
    
    return `
        <div class="bg-white p-4 rounded-lg">
            <div class="relative rounded-lg overflow-hidden shadow-lg" style="height: 300px; background: ${getTemplateGradient(cardData.template)};">
                <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                <div class="relative z-10 h-full flex flex-col justify-between p-6 text-white">
                    <div class="text-center">
                        <h4 class="font-bold mb-2 text-2xl drop-shadow-lg">To. ${cardData.to}</h4>
                    </div>
                    <div class="flex-1 flex flex-col justify-center">
                        ${cardData.messages.length > 0 ? 
                            cardData.messages.map(msg => `<p class="text-base mb-2 drop-shadow-lg text-center">• ${msg}</p>`).join('') :
                            '<p class="text-base drop-shadow-lg text-center">선택된 격려 메시지가 없습니다.</p>'
                        }
                        ${cardData.customMessage ? `<div class="bg-white bg-opacity-25 rounded p-3 mt-3 text-base text-center backdrop-blur-sm"><p class="drop-shadow-lg">${cardData.customMessage}</p></div>` : ''}
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-medium drop-shadow-lg">From. ${cardData.from}</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-3 bg-gray-100 rounded-lg">
                <h5 class="font-bold text-gray-700 mb-2">선택된 격려 메시지들:</h5>
                ${cardData.messages.length > 0 ? 
                    `<ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                        ${cardData.messages.map(msg => `<li>${msg}</li>`).join('')}
                    </ul>` :
                    '<p class="text-sm text-gray-500">선택된 메시지가 없습니다.</p>'
                }
                ${cardData.customMessage ? 
                    `<div class="mt-3 pt-3 border-t border-gray-300">
                        <h6 class="font-semibold text-gray-700 mb-1">나만의 특별한 메시지:</h6>
                        <p class="text-sm text-gray-600 italic">"${cardData.customMessage}"</p>
                    </div>` : ''
                }
            </div>
        </div>
    `;
}

// ===== 보고서 다운로드 =====
async function downloadReportAsImage() {
    setButtonLoading('download-image-btn', true, '📸 생성 중...');
    
    try {
        const element = document.getElementById('result-container');
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f0fdf4'
        });
        
        const link = document.createElement('a');
        link.download = `컨설팅보고서_${state.currentStudent.name || '익명'}_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        const button = document.getElementById('download-image-btn');
        button.innerHTML = '✅ 저장 완료!';
        setTimeout(() => {
            setButtonLoading('download-image-btn', false);
        }, 2000);
        
    } catch (error) {
        console.error('이미지 생성 오류:', error);
        const button = document.getElementById('download-image-btn');
        button.innerHTML = '❌ 오류 발생';
        setTimeout(() => {
            setButtonLoading('download-image-btn', false);
        }, 2000);
        alert('이미지 생성 중 오류가 발생했습니다.');
    }
}

async function downloadReportAsPDF() {
    setButtonLoading('download-pdf-btn', true, '📄 생성 중...');
    
    try {
        const element = document.getElementById('result-container');
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f0fdf4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`컨설팅보고서_${state.currentStudent.name || '익명'}_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        const button = document.getElementById('download-pdf-btn');
        button.innerHTML = '✅ 저장 완료!';
        setTimeout(() => {
            setButtonLoading('download-pdf-btn', false);
        }, 2000);
        
    } catch (error) {
        console.error('PDF 생성 오류:', error);
        const button = document.getElementById('download-pdf-btn');
        button.innerHTML = '❌ 오류 발생';
        setTimeout(() => {
            setButtonLoading('download-pdf-btn', false);
        }, 2000);
        alert('PDF 생성 중 오류가 발생했습니다.');
    }
}

// ===== 네비게이션 =====
function newChallengeFromResult() {
    hideElement('result-screen');
    showElement('consulting-screen');
    loadNewCase();
    
    document.getElementById('empathy').value = '';
    document.getElementById('suggestion').value = '';
    state.consultingData = { empathy: '', suggestion: '' };
    state.selectedMessages = [];
    updateSelectedMessages();
}

function restartApp() {
    resetAll();
    showElement('start-screen');
    hideElement('result-screen');
}

function resetAll() {
    // 폼 리셋
    document.getElementById('consulting-form')?.reset();
    document.getElementById('grade').value = '';
    document.getElementById('class').value = '';
    document.getElementById('name').value = '';
    document.getElementById('card-to').value = '';
    document.getElementById('card-from').value = '';
    document.getElementById('custom-message').value = '';
    
    // 감정 버튼 리셋
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected', 'bg-green-100', 'border-green-500');
        btn.classList.add('border-gray-300');
    });
    document.getElementById('selected-emotions').innerHTML = '';
    
    // 체크박스 리셋
    document.querySelectorAll('.suggestion-check').forEach(cb => {
        cb.checked = false;
    });
    
    // 상태 리셋
    resetState();
    
    // UI 리셋
    document.getElementById('upload-placeholder')?.classList.remove('hidden');
    document.getElementById('background-preview')?.classList.add('hidden');
    document.getElementById('remove-background-btn')?.classList.add('hidden');
    
    document.getElementById('drawn-message').textContent = '버튼을 눌러 격려 메시지를 뽑아보세요!';
    document.getElementById('add-message-btn')?.classList.add('hidden');
    updateSelectedMessages();
    updateCardPreview();
    
    // 템플릿 선택 리셋
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('border-purple-400', 'bg-purple-100');
        btn.classList.add('border-gray-300');
        if (btn.dataset.template === 'pastel') {
            btn.classList.remove('border-gray-300');
            btn.classList.add('border-purple-400', 'bg-purple-100');
        }
    });
    
    // 글자색 선택 리셋
    document.querySelectorAll('.text-color-btn').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-purple-400');
        if (btn.dataset.color === 'white') {
            btn.classList.add('ring-4', 'ring-purple-400');
        }
    });
}

// ===== DOMContentLoaded 이벤트 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM 로드 완료 ===');
    initializeApp();
});

// ===== 전역 에러 핸들러 =====
window.addEventListener('error', function(event) {
    console.error('전역 에러 발생:', event.error);
});

// utils 모듈 import 추가 (generateCardResultHTML에서 사용)
import * as utils from './utils.js';

console.log('=== 스크립트 로드 완료 ===');