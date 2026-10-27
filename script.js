document.addEventListener('DOMContentLoaded', () => {
    // เซ็ตวันที่เป็นวันปัจจุบันเสมอ
    document.getElementById('reportDate').valueAsDate = new Date();

    const locationInput = document.getElementById('location');
    const shiftRadios = document.querySelectorAll('input[name="shift"]');
    const guardListContainer = document.getElementById('guardListContainer');
    const addCustomPostContainer = document.getElementById('addCustomPostContainer');
    const addCustomPostBtn = document.getElementById('addCustomPostBtn');
    const totalCountSpan = document.getElementById('totalCount');
    const reportForm = document.getElementById('reportForm');
    const submitBtn = document.getElementById('submitBtn');

    // ตัวแปรสำหรับระบบเปลี่ยนหน้า UI และเปลี่ยนชื่อหัวข้อ
    const unitSelectionView = document.getElementById('unitSelectionView');
    const mainFormView = document.getElementById('mainFormView');
    const unitBtns = document.querySelectorAll('.unit-btn');
    const backToUnitsBtn = document.getElementById('backToUnitsBtn');
    const pageMainTitle = document.getElementById('pageMainTitle');

    // จัดการคลิกเลือกพื้นที่
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedUnit = this.getAttribute('data-unit');
            
            // เซ็ตค่าลงใน Hidden Input
            locationInput.value = selectedUnit;
            
            // เปลี่ยนข้อความใต้โลโก้เป็นชื่อพื้นที่ และเปลี่ยนเป็นสีเขียวธีม
            pageMainTitle.textContent = selectedUnit;
            pageMainTitle.style.color = '#315d38';

            // สลับหน้าจอไปหน้าฟอร์ม
            unitSelectionView.style.display = 'none';
            mainFormView.style.display = 'block';

            // สั่งให้ระบบสร้างตาราง (ถ้าระบุผลัดไว้แล้ว)
            renderPosts();
        });
    });

    // จัดการคลิกปุ่มย้อนกลับไปเลือกพื้นที่
    backToUnitsBtn.addEventListener('click', () => {
        // สลับหน้าจอกลับไปหน้าเลือกพื้นที่
        mainFormView.style.display = 'none';
        unitSelectionView.style.display = 'block';
        
        // คืนค่าข้อความหัวข้อใต้โลโก้กลับเป็นแบบเดิม
        pageMainTitle.textContent = 'รายงานจำนวน รปภ. ประจำวัน';
        pageMainTitle.style.color = '#2c3e50';
        
        // ล้างค่าข้อมูล
        locationInput.value = '';
        shiftRadios.forEach(radio => radio.checked = false);
        guardListContainer.innerHTML = '<div class="alert alert-secondary text-center" style="background-color: #f4f7f4; border-color: #e2ebe2; color: #5a755d;">กรุณาเลือกผลัดการทำงานเพื่อแสดงจุดปฏิบัติงาน...</div>';
        addCustomPostContainer.style.display = 'none';
        totalCountSpan.textContent = '0';
    });

    let guardNamesData = []; 

    // ข้อมูลจุดปฏิบัติงาน
    const postData = {
        "เช้า": {
            "ส่วนกลาง": [
                "ผู้จัดการโครงการส่วนกลาง", "หัวหน้าชุด รปภ.ส่วนกลาง", "ลานจอดรถP5", "ประตู1",
                "ประตู2", "ประตู3", "ประตู4", "ประตู5", "ประตู6",
                "ลานจอดรถP1", "ลานจอดสระว่ายน้ำ", "กองกายภาพและสิ่งแวดล้อม",
                "สถานีรถราง", "อาคารบรรยายรวม 1-2", "L2 ( แนวจักรยาน4 )", "ลานจอดรถP3", 
                "ลานจอดรถP4", "ถนนดำรงวิจัย ( ลานจอดกองฯ )", "โรงสูบน้ำ1", "โรงสูบน้ำ4", 
                "ลานเป็ดขาว", "เรือนไทย", "แยกลานอเนกฯ", "แม่และเด็ก",
                "ถนนสานสัตยา", "แนวถนนเทิดจักรี", "อาคารเจรจา"
            ],
            "ศูนย์การเรียนรู้มหิดล": [
                "หัวหน้าชุด รปภ.MLC", "M.2", "M.3", "M.4", "M.5", "M.6", "M.7", "M.8", "M.9", "M.10", "M.11", "M.12"
            ],
            "มหิดลสิทธาคาร": [
                "หัวหน้าชุด รปภ.สิทธาคาร", "S.2", "S.3", "S.4", "S.5", "S.6", "S.7", "S.8", "S.9", "S.10"
            ],
            "ลานจอดมหิดลสิทธาคาร": [
                "หัวหน้าชุด รปภ.SP1", "SP.2", "SP.3", "SP.4", "SP.5", "SP.6", "SP.7", "SP.8", "SP.9", "SP.10"
            ],
            "อาคารสิริวิทยา": [
                "หัวหน้าชุด รปภ.LA", "LA.02", "LA.03", "LA.04", "LA.05", "LA.06", "LA.07"
            ],
            "โครงการจัดตั้งสถาบันอุทยานธรรมชาติวิทยาสิรีรุกขชาติ": [
                "หัวหน้าชุด รปภ.สิรีรุกขชาติ", "SR.02", "SR.03", "SR.04", "SR.05", "SR.06", "SR.07", "SR.08", "SR.09", "SR.10"
            ],
            "หอพักนักศึกษา": [
                "หัวหน้าชุด รปภ.หอพักนักศึกษา", "ป้อมหน้าหอ11", "หอ11", "หน้าหอ10", "หน้าหอ1-2", "หน้าหอ6-7", "หน้าหอ8-9",
                "ป้อมโรงช้าง", "ประตูทางเข้าหอ1-2", "ประตูทางเข้าหอ3-4", "ประตูทางเข้าหอ6-7", "ประตูทางเข้ารถราง", "ทางเท้าเดินหลังหอพัก"
            ]
        },
        "กลางคืน": {
            "ส่วนกลาง": [
                "หัวหน้าชุด รปภ.ส่วนกลาง", "ลานจอดรถP5", "ประตู1",
                "ประตู2", "ประตู3", "ประตู4", "ประตู5", "ประตู6",
                "ลานจอดรถP1", "กองกายภาพและสิ่งแวดล้อม",
                "สถานีรถราง", "อาคารบรรยายรวม 1-2 ( เรือนไทย )", "ลานจอดรถP3 ( แยกแม่และเด็ก )", 
                "ลานจอดรถP4", "ถนนดำรงวิจัย", "โรงสูบน้ำ1", "โรงสูบน้ำ4",
                "อาคารเจรจา"
            ],
            "ศูนย์การเรียนรู้มหิดล": [
                "หัวหน้าชุด รปภ.MLC", "M.14", "M.15", "M.16", "M.17", "M.18", "M.19"
            ],
            "มหิดลสิทธาคาร": [
                "หัวหน้าชุด รปภ.สิทธาคาร", "S.2", "S.3", "S.4", "S.5", "S.6"
            ],
            "ลานจอดมหิดลสิทธาคาร": [
                "หัวหน้าชุด รปภ.SP1", "SP.2", "SP.3", "SP.4", "SP.5", "SP.6"
            ],
            "อาคารสิริวิทยา": [
                "หัวหน้าชุด รปภ.LA", "LA.09", "LA.10"
            ],
            "โครงการจัดตั้งสถาบันอุทยานธรรมชาติวิทยาสิรีรุกขชาติ": [
                "หัวหน้าชุด รปภ.สิรีรุกขชาติ", "SR.02", "SR.03", "SR.04"
            ],
            "หอพักนักศึกษา": [
                "หัวหน้าชุด รปภ.หอพักนักศึกษา", "ป้อมหน้าหอ11", "หอ11", "หน้าหอ10", "หน้าหอ1-2", "หน้าหอ6-7", "หน้าหอ8-9",
                "ป้อมโรงช้าง", "ประตูทางเข้าหอ1-2", "ประตูทางเข้าหอ3-4", "ประตูทางเข้าหอ6-7"
            ]
        }
    };

    // ดึงรายชื่อจาก Google Sheet
    async function fetchGuardNames() {
        const statusDiv = document.getElementById('dataStatus');
        try {
            const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL);
            const data = await response.json();
            
            if (data.names && data.names.length > 0) {
                guardNamesData = data.names; 
                
                if (statusDiv) {
                    statusDiv.className = 'alert alert-success text-center py-2 mb-3 shadow-sm';
                    statusDiv.innerHTML = '✅ โหลดรายชื่อสำเร็จ ระบบพร้อมใช้งานแล้ว!';
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Error fetching names:', error);
            if (statusDiv) {
                statusDiv.className = 'alert alert-danger text-center py-2 mb-3 shadow-sm';
                statusDiv.innerHTML = '❌ เชื่อมต่อฐานข้อมูลล้มเหลว กรุณารีเฟรชหน้าเว็บอีกครั้ง';
            }
        }
    }

    fetchGuardNames();

    // อัปเดตยอดรวม รปภ.
    function updateTotalCount() {
        const total = document.querySelectorAll('.name-input').length;
        totalCountSpan.textContent = total;
    }

    // สร้างช่องกรอกชื่อ
    function createGuardInput(isFirst = false) {
        const div = document.createElement('div');
        div.className = 'input-group guard-item position-relative';
        
        div.innerHTML = `
            <input type="text" class="form-control name-input" placeholder="ชื่อ-นามสกุล รปภ." autocomplete="off" required>
            <button type="button" class="btn btn-outline-danger remove-guard-btn fw-bold" style="font-size: 1.2rem; padding: 0 15px;" tabindex="-1" title="ลบรายชื่อ" ${isFirst ? 'disabled' : ''}>-</button>
            <div class="autocomplete-list shadow-sm w-100" style="display: none; position: absolute; top: 100%; left: 0; z-index: 1000; background: white; border: 1px solid #ced4da; border-radius: 0 0 8px 8px; max-height: 200px; overflow-y: auto;"></div>
        `;
        
        const inputField = div.querySelector('.name-input');
        const autocompleteList = div.querySelector('.autocomplete-list');
        
        inputField.addEventListener('input', function() {
            const val = this.value.trim();
            autocompleteList.innerHTML = '';
            
            if (!val) {
                autocompleteList.style.display = 'none';
                return;
            }
            
            const matchedNames = guardNamesData.filter(name => name.toLowerCase().includes(val.toLowerCase()));
            
            if (matchedNames.length > 0) {
                autocompleteList.style.display = 'block';
                matchedNames.forEach(name => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'autocomplete-item';
                    
                    const regex = new RegExp(`(${val})`, "gi");
                    itemDiv.innerHTML = name.replace(regex, "<span style='background-color: #a5c184; font-weight: bold;'>$1</span>");
                    
                    itemDiv.addEventListener('click', function() {
                        inputField.value = name;
                        autocompleteList.style.display = 'none';
                    });
                    
                    autocompleteList.appendChild(itemDiv);
                });
            } else {
                autocompleteList.style.display = 'none';
            }
        });

        document.addEventListener('click', function(e) {
            if (!div.contains(e.target)) {
                autocompleteList.style.display = 'none';
            }
        });
        
        inputField.addEventListener('focus', function() {
            if (this.value && autocompleteList.children.length > 0) {
                autocompleteList.style.display = 'block';
            }
        });
        
        div.querySelector('.remove-guard-btn').addEventListener('click', function() {
            div.remove();
            updateTotalCount();
        });
        
        return div;
    }

    // สร้างกล่องจุดปฏิบัติงาน
    function createPostBlock(postName = "", isCustom = false) {
        const block = document.createElement('div');
        block.className = 'post-card';
        
        let titleHtml = '';
        if (isCustom) {
            titleHtml = `
                <div class="col-10">
                    <input type="text" class="form-control point-input" placeholder="ระบุจุดปฏิบัติงาน (พิมพ์เอง)" value="${postName}" required>
                </div>
                <div class="col-2 text-end">
                    <button type="button" class="btn btn-danger remove-post-btn fw-bold" style="font-size: 1.2rem; padding: 0 15px;" tabindex="-1" title="ลบจุดนี้">-</button>
                </div>
            `;
        } else {
            titleHtml = `
                <div class="col-12 d-flex align-items-center">
                    <span class="post-title-text text-primary fw-bold" style="color: #315d38 !important;">${postName}</span>
                    <input type="hidden" class="point-input" value="${postName}">
                </div>
            `;
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'row post-title';
        titleDiv.innerHTML = titleHtml;
        
        const removePostBtn = titleDiv.querySelector('.remove-post-btn');
        if (removePostBtn) {
            removePostBtn.addEventListener('click', () => {
                block.remove();
                updateTotalCount();
            });
        }

        const guardsContainer = document.createElement('div');
        guardsContainer.className = 'guards-container';
        guardsContainer.appendChild(createGuardInput(true)); 

        const addGuardBtn = document.createElement('button');
        addGuardBtn.type = 'button';
        addGuardBtn.className = 'btn btn-sm btn-outline-theme mt-2';
        addGuardBtn.innerHTML = '+ เพิ่ม รปภ. ประจำจุดนี้ (กรณีมีมากกว่า 1 คน)';
        addGuardBtn.addEventListener('click', () => {
            guardsContainer.appendChild(createGuardInput(false));
            updateTotalCount();
        });

        block.appendChild(titleDiv);
        block.appendChild(guardsContainer);
        block.appendChild(addGuardBtn);

        return block;
    }

    // แสดงจุดปฏิบัติงานตามผลัดและพื้นที่
    function renderPosts() {
        guardListContainer.innerHTML = ''; 
        const loc = locationInput.value;
        const shiftSelected = document.querySelector('input[name="shift"]:checked');
        
        if (!loc) {
            return;
        }

        if (!shiftSelected) {
            guardListContainer.innerHTML = '<div class="alert alert-info text-center" style="background-color: #f4f7f4; border-color: #e2ebe2; color: #5a755d;">กรุณากดเลือก "ผลัดการทำงาน" (เช้า/กลางคืน) เพื่อดูจุดปฏิบัติงานครับ</div>';
            addCustomPostContainer.style.display = 'none';
            updateTotalCount();
            return;
        }

        const shift = shiftSelected.value;

        if (postData[shift] && postData[shift][loc]) {
            const points = postData[shift][loc];
            points.forEach(point => {
                guardListContainer.appendChild(createPostBlock(point, false));
            });
            addCustomPostContainer.style.display = 'block';
        } else {
            guardListContainer.appendChild(createPostBlock("", true));
            addCustomPostContainer.style.display = 'block';
        }
        updateTotalCount();
    }

    // ดักจับการเปลี่ยนผลัดทำงาน
    shiftRadios.forEach(radio => radio.addEventListener('change', renderPosts));

    // ปุ่มเพิ่มจุดทำงานเอง
    addCustomPostBtn.addEventListener('click', () => {
        guardListContainer.appendChild(createPostBlock("", true));
        updateTotalCount();
    });

    // ส่งข้อมูลฟอร์ม
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!CONFIG.GOOGLE_SCRIPT_URL || CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            alert('กรุณานำ URL จาก Google Apps Script มาใส่ในไฟล์ config.js ก่อนครับ');
            return;
        }

        const count = document.querySelectorAll('.name-input').length;
        if (count === 0) {
            alert('กรุณาเพิ่ม รปภ. อย่างน้อย 1 คน');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> กำลังบันทึกข้อมูล...';

        const date = document.getElementById('reportDate').value;
        const location = locationInput.value;
        const shift = document.querySelector('input[name="shift"]:checked').value;
        
        const guardData = [];
        document.querySelectorAll('.post-card').forEach(card => {
            const pointName = card.querySelector('.point-input').value;
            card.querySelectorAll('.name-input').forEach(nameInput => {
                if (nameInput.value.trim() !== '') {
                    guardData.push({
                        point: pointName,
                        name: nameInput.value.trim()
                    });
                }
            });
        });

        const payload = {
            date: date,
            location: location,
            shift: shift,
            totalGuards: guardData.length,
            guards: guardData
        };

        try {
            await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            alert('บันทึกข้อมูลลง Sheet สำเร็จ!');
            
            // รีเซ็ตค่าและกลับไปหน้าเลือกพื้นที่
            reportForm.reset();
            document.getElementById('reportDate').valueAsDate = new Date();
            locationInput.value = '';
            document.querySelectorAll('input[name="shift"]').forEach(radio => radio.checked = false);
            guardListContainer.innerHTML = '';
            addCustomPostContainer.style.display = 'none';
            updateTotalCount();
            
            mainFormView.style.display = 'none';
            unitSelectionView.style.display = 'block';
            pageMainTitle.textContent = 'รายงานจำนวน รปภ. ประจำวัน';
            pageMainTitle.style.color = '#2c3e50';

        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'บันทึกข้อมูลลง Google Sheet';
        }
    });
});