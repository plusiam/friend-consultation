// 데이터 로더 모듈
export async function loadData() {
    try {
        const [worries, encouragements] = await Promise.all([
            fetch('./data/worries.json').then(res => res.json()),
            fetch('./data/encouragements.json').then(res => res.json())
        ]);
        
        return {
            worryDatabase: worries,
            encouragementMessages: encouragements
        };
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        // 폴백 데이터 반환
        return {
            worryDatabase: [
                { 
                    title: "기본 고민 사례", 
                    content: "데이터를 불러오는 중 오류가 발생했습니다. 새로고침 해주세요." 
                }
            ],
            encouragementMessages: [
                "힘내세요!",
                "응원합니다!"
            ]
        };
    }
}

// 전역 상태 관리
export const state = {
    currentCase: null,
    currentStudent: { grade: '', class: '', name: '' },
    consultingData: { empathy: '', suggestion: '' },
    selectedMessages: [],
    currentTemplate: 'pastel',
    currentTextColor: 'white',
    backgroundImage: null,
    data: {
        worryDatabase: [],
        encouragementMessages: []
    }
};

// 상태 초기화
export function resetState() {
    state.currentCase = null;
    state.currentStudent = { grade: '', class: '', name: '' };
    state.consultingData = { empathy: '', suggestion: '' };
    state.selectedMessages = [];
    state.currentTemplate = 'pastel';
    state.currentTextColor = 'white';
    state.backgroundImage = null;
}