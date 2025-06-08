// 로컬 스토리지에서 데이터 로드
let geckos = JSON.parse(localStorage.getItem('geckos')) || [];

// 이미지 프리뷰 기능
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(file);
        }
    });
}

// 이미지 프리뷰 설정
setupImagePreview('photo', 'photoPreview');
setupImagePreview('parentPhoto', 'parentPhotoPreview');

// 폼 제출 처리
document.getElementById('geckoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const gecko = {
        id: Date.now(),
        name: document.getElementById('name').value,
        hatchDate: document.getElementById('hatchDate').value,
        photo: document.getElementById('photoPreview').querySelector('img')?.src || '',
        parentPhoto: document.getElementById('parentPhotoPreview').querySelector('img')?.src || '',
        parentInfo: document.getElementById('parentInfo').value,
        weightHistory: [{
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(document.getElementById('weight').value)
        }]
    };
    
    geckos.push(gecko);
    localStorage.setItem('geckos', JSON.stringify(geckos));
    
    // 폼 초기화
    this.reset();
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('parentPhotoPreview').innerHTML = '';
    
    // 목록 업데이트
    displayGeckos();
});

// 무게 기록 추가
function addWeightEntry(geckoId) {
    const weight = prompt('새로운 무게를 입력하세요 (g):');
    if (weight === null) return;
    
    const gecko = geckos.find(g => g.id === geckoId);
    if (gecko) {
        gecko.weightHistory.push({
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(weight)
        });
        localStorage.setItem('geckos', JSON.stringify(geckos));
        displayGeckos();
    }
}

// 개체 삭제
function deleteGecko(geckoId) {
    if (confirm('정말로 이 개체를 삭제하시겠습니까?')) {
        geckos = geckos.filter(g => g.id !== geckoId);
        localStorage.setItem('geckos', JSON.stringify(geckos));
        displayGeckos();
    }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 개체 목록 표시
function displayGeckos() {
    const geckoList = document.getElementById('geckoList');
    geckoList.innerHTML = '';
    
    geckos.forEach(gecko => {
        const card = document.createElement('div');
        card.className = 'gecko-card';
        
        const latestWeight = gecko.weightHistory[gecko.weightHistory.length - 1];
        
        card.innerHTML = `
            <div class="gecko-image">
                <img src="${gecko.photo}" alt="${gecko.name}">
            </div>
            <div class="gecko-info">
                <h3>🦎 ${gecko.name}</h3>
                <p>🥚 해칭일: ${formatDate(gecko.hatchDate)}</p>
                <p>⚖️ 현재 무게: ${latestWeight.weight}g (${formatDate(latestWeight.date)})</p>
                ${gecko.parentInfo ? `<p>📝 부모 정보: ${gecko.parentInfo}</p>` : ''}
                ${gecko.parentPhoto ? `<img src="${gecko.parentPhoto}" alt="부모 사진" style="max-width: 200px; margin-top: 10px;">` : ''}
                
                <div class="weight-history">
                    <h4>📊 무게 기록</h4>
                    ${gecko.weightHistory.map(entry => `
                        <div class="weight-entry">
                            <span>📅 ${formatDate(entry.date)}</span>
                            <span>⚖️ ${entry.weight}g</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="actions">
                    <button onclick="addWeightEntry(${gecko.id})">⚖️ 무게 추가</button>
                    <button onclick="deleteGecko(${gecko.id})">🗑️ 삭제</button>
                </div>
            </div>
        `;
        
        geckoList.appendChild(card);
    });
}

// 초기 로드
displayGeckos();
