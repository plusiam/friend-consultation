// 격려 카드 제작 모듈
import { state } from './data.js';
import { getTemplateGradient, getTextColorClass, setButtonLoading } from './utils.js';
import { updateSelectedMessages } from './consulting.js';

// 격려 메시지 뽑기
export function drawEncouragementMessage() {
    const randomIndex = Math.floor(Math.random() * state.data.encouragementMessages.length);
    const message = state.data.encouragementMessages[randomIndex];
    
    document.getElementById('drawn-message').textContent = message;
    document.getElementById('add-message-btn').classList.remove('hidden');
    document.getElementById('add-message-btn').dataset.message = message;
}

// 메시지 추가하기
export function addEncouragementMessage(e) {
    const message = e.target.dataset.message;
    if (state.selectedMessages.length < 4 && !state.selectedMessages.includes(message)) {
        state.selectedMessages.push(message);
        updateSelectedMessages();
        updateCardPreview();
    }
}

// 배경 이미지 업로드 처리
export function handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            state.backgroundImage = e.target.result;
            document.getElementById('background-img').src = state.backgroundImage;
            document.getElementById('upload-placeholder').classList.add('hidden');
            document.getElementById('background-preview').classList.remove('hidden');
            document.getElementById('remove-background-btn').classList.remove('hidden');
            updateCardPreview();
        };
        reader.readAsDataURL(file);
    }
}

// 배경 이미지 제거
export function removeBackgroundImage() {
    state.backgroundImage = null;
    document.getElementById('upload-placeholder').classList.remove('hidden');
    document.getElementById('background-preview').classList.add('hidden');
    document.getElementById('remove-background-btn').classList.add('hidden');
    updateCardPreview();
}

// 템플릿 선택
export function selectTemplate(e) {
    document.querySelectorAll('.template-btn').forEach(b => {
        b.classList.remove('border-purple-400', 'bg-purple-100');
        b.classList.add('border-gray-300');
    });
    e.target.classList.remove('border-gray-300');
    e.target.classList.add('border-purple-400', 'bg-purple-100');
    
    state.currentTemplate = e.target.dataset.template;
    updateCardPreview();
}

// 글자색 선택
export function selectTextColor(e) {
    document.querySelectorAll('.text-color-btn').forEach(b => {
        b.classList.remove('ring-4', 'ring-purple-400');
    });
    e.target.classList.add('ring-4', 'ring-purple-400');
    
    state.currentTextColor = e.target.dataset.color;
    updateCardPreview();
}

// 카드 미리보기 업데이트
export function updateCardPreview() {
    const to = document.getElementById('card-to')?.value || '친구';
    const from = document.getElementById('card-from')?.value || '나';
    const customMessage = document.getElementById('custom-message')?.value.trim() || '';
    
    const cardBackground = document.getElementById('card-background');
    if (cardBackground) {
        if (state.backgroundImage) {
            cardBackground.style.backgroundImage = `url(${state.backgroundImage})`;
            cardBackground.style.backgroundSize = 'cover';
            cardBackground.style.backgroundPosition = 'center';
            cardBackground.style.background = '';
        } else {
            cardBackground.style.backgroundImage = '';
            cardBackground.style.background = getTemplateGradient(state.currentTemplate);
        }
    }
    
    const textColor = getTextColorClass(state.currentTextColor);
    const cardContent = document.querySelector('#card-preview .relative.z-10');
    if (cardContent) {
        cardContent.style.color = textColor;
    }
    
    const previewTo = document.getElementById('preview-to');
    const previewFrom = document.getElementById('preview-from');
    if (previewTo) previewTo.textContent = to;
    if (previewFrom) previewFrom.textContent = from;
    
    const messagesContainer = document.getElementById('preview-messages');
    if (messagesContainer) {
        if (state.selectedMessages.length > 0) {
            const fontSize = state.selectedMessages.length <= 2 ? 'text-lg' : state.selectedMessages.length <= 3 ? 'text-base' : 'text-sm';
            const spacing = state.selectedMessages.length <= 2 ? 'space-y-3' : 'space-y-2';
            
            messagesContainer.className = `${spacing} text-center`;
            messagesContainer.innerHTML = state.selectedMessages.map(msg => 
                `<p class="${fontSize} text-shadow leading-relaxed">• ${msg}</p>`
            ).join('');
        } else {
            messagesContainer.className = 'text-center';
            messagesContainer.innerHTML = '<p class="text-base text-shadow">여기에 격려 메시지가 표시됩니다.</p>';
        }
    }
    
    const customContainer = document.getElementById('preview-custom');
    const customText = document.getElementById('preview-custom-text');
    
    if (customContainer && customText) {
        if (customMessage) {
            customContainer.style.display = 'block';
            
            let customFontSize, boxHeight;
            if (customMessage.length <= 30) {
                customFontSize = 'text-base';
                boxHeight = '60px';
            } else if (customMessage.length <= 60) {
                customFontSize = 'text-sm';
                boxHeight = '80px';
            } else if (customMessage.length <= 100) {
                customFontSize = 'text-xs';
                boxHeight = '100px';
            } else {
                customFontSize = 'text-xs';
                boxHeight = '120px';
            }
            
            customText.className = `${customFontSize} text-shadow leading-relaxed`;
            customText.textContent = customMessage;
            customContainer.style.minHeight = boxHeight;
            
            if (customMessage.length > 150) {
                customContainer.style.maxHeight = '120px';
                customContainer.style.overflowY = 'auto';
            } else {
                customContainer.style.overflowY = 'visible';
            }
        } else {
            customContainer.style.display = 'none';
        }
    }
}

// 카드 이미지 다운로드
export async function downloadCardImage() {
    console.log('카드 이미지 다운로드 시작');
    const canvas = document.getElementById('card-canvas');
    const ctx = canvas.getContext('2d');
    
    setButtonLoading('download-card-btn', true, '📥 저장 중...');
    
    canvas.width = 1200;
    canvas.height = 800;
    
    const to = document.getElementById('card-to').value || '친구';
    const from = document.getElementById('card-from').value || '나';
    const customMessage = document.getElementById('custom-message').value.trim();
    
    try {
        // 배경 그리기
        if (state.backgroundImage) {
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = state.backgroundImage;
            });
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            
            // 템플릿별 그라디언트 색상 설정
            const gradientColors = {
                pastel: [['#ffecd2', 0], ['#fcb69f', 0.5], ['#ff9a9e', 1]],
                nature: [['#a8edea', 0], ['#fed6e3', 0.5], ['#d299c2', 1]],
                sky: [['#89f7fe', 0], ['#66a6ff', 0.5], ['#a855f7', 1]],
                sunset: [['#ff9a9e', 0], ['#fecfef', 0.5], ['#fecfef', 1]],
                ocean: [['#667eea', 0], ['#764ba2', 0.5], ['#f093fb', 1]],
                forest: [['#4ecdc4', 0], ['#44a08d', 0.5], ['#093637', 1]]
            };
            
            const colors = gradientColors[state.currentTemplate] || gradientColors.pastel;
            colors.forEach(([color, stop]) => gradient.addColorStop(stop, color));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 오버레이
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 텍스트 스타일 설정
        ctx.fillStyle = getTextColorClass(state.currentTextColor);
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // To 텍스트
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.fillText(`To. ${to}`, canvas.width / 2, 120);
        
        // 메시지들
        let messageY = 200;
        const messageSpacing = state.selectedMessages.length <= 2 ? 80 : state.selectedMessages.length <= 3 ? 65 : 55;
        const messageFontSize = state.selectedMessages.length <= 2 ? 36 : state.selectedMessages.length <= 3 ? 32 : 28;
        
        ctx.font = `${messageFontSize}px Arial, sans-serif`;
        
        state.selectedMessages.forEach((message) => {
            wrapText(ctx, `• ${message}`, canvas.width / 2, messageY, canvas.width - 200, messageSpacing);
            messageY += messageSpacing;
        });
        
        // 커스텀 메시지
        if (customMessage) {
            messageY += 30;
            
            // 배경 박스
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            const customHeight = Math.max(80, Math.ceil(customMessage.length / 50) * 40);
            ctx.fillRect(100, messageY - 25, canvas.width - 200, customHeight);
            
            // 텍스트
            ctx.fillStyle = getTextColorClass(state.currentTextColor);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            
            const customFontSize = customMessage.length <= 30 ? 32 : customMessage.length <= 60 ? 28 : customMessage.length <= 100 ? 24 : 20;
            ctx.font = `${customFontSize}px Arial, sans-serif`;
            
            wrapText(ctx, customMessage, canvas.width / 2, messageY + 15, canvas.width - 250, customFontSize + 5);
        }
        
        // From 텍스트
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`From. ${from}`, canvas.width - 80, canvas.height - 60);
        
        // 다운로드
        const link = document.createElement('a');
        link.download = `격려카드_${to}_${from}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        // 성공 표시
        const downloadBtn = document.getElementById('download-card-btn');
        downloadBtn.innerHTML = '✅ 저장 완료!';
        downloadBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            setButtonLoading('download-card-btn', false);
            downloadBtn.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('카드 이미지 생성 중 오류:', error);
        
        const downloadBtn = document.getElementById('download-card-btn');
        downloadBtn.innerHTML = '❌ 저장 실패';
        downloadBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        setTimeout(() => {
            setButtonLoading('download-card-btn', false);
            downloadBtn.style.background = '';
        }, 3000);
        
        alert('카드 이미지 다운로드 중 오류가 발생했습니다.');
    }
}

// 텍스트 줄바꿈 헬퍼 함수
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}