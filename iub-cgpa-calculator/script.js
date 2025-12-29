
        // Grade mapping
        const gradePoints = {
            'A': 4.00,
            'A-': 3.70,
            'B+': 3.30,
            'B': 3.00,
            'B-': 2.70,
            'C+': 2.30,
            'C': 2.00,
            'C-': 1.70,
            'D+': 1.30,
            'D': 1.00,
            'F': 0.00
        };
        
        // Initialize with 3 courses and previous result row when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializePreviousResult();
            initializeCourses();
            calculateCGPA();
            
            // Fix for iOS select zoom issue
            const gradeSelects = document.querySelectorAll('.grade-select');
            gradeSelects.forEach(select => {
                select.addEventListener('focus', function() {
                    // Prevent iOS zoom
                    this.style.fontSize = '16px';
                });
            });
        });
        
        let courseCounter = 3;
        
        // Function to initialize previous result section
        function initializePreviousResult() {
            const tableBody = document.getElementById('previousTableBody');
            tableBody.innerHTML = '';
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="previous-fixed-value">Transcript</td>
                <td>
                    <input type="number" class="previous-input previous-cgpa" 
                           placeholder="0.00" 
                           min="0.0" max="4.0" step="0.01">
                </td>
                <td>
                    <input type="number" class="previous-input previous-credits" 
                           placeholder="0.0" 
                           min="0" step="0.5">
                </td>
            `;
            
            // Add event listeners to previous result inputs
            const inputs = row.querySelectorAll('.previous-input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Remove error class when user starts typing
                    this.classList.remove('error');
                    
                    if (document.getElementById('autoCalculate').checked) {
                        calculateCGPA();
                    }
                });
            });
            
            tableBody.appendChild(row);
        }
        
        // Function to create a course row
        function createCourseRow(courseNumber) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <input type="text" class="course-input course-name" 
                           placeholder="Course ${courseNumber}" 
                           value="Course ${courseNumber}">
                </td>
                <td>
                    <input type="number" class="course-input credit" 
                           placeholder="3" 
                           min="0.5" max="10" step="0.5">
                </td>
                <td>
                    <select class="grade-select grade" data-course="${courseNumber}">
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C-</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                </td>
                <td class="action-cell">
                    <button class="delete-btn" title="Delete Course">
                        <span class="delete-icon">×</span>
                    </button>
                </td>
            `;
            
            // Add event listeners to inputs
            const nameInput = row.querySelector('.course-name');
            const creditInput = row.querySelector('.credit');
            const gradeSelect = row.querySelector('.grade-select');
            
            nameInput.addEventListener('input', function() {
                this.classList.remove('error');
                if (document.getElementById('autoCalculate').checked) {
                    calculateCGPA();
                }
            });
            
            creditInput.addEventListener('input', function() {
                this.classList.remove('error');
                if (document.getElementById('autoCalculate').checked) {
                    calculateCGPA();
                }
            });
            
            gradeSelect.addEventListener('change', function() {
                this.classList.remove('error');
                if (document.getElementById('autoCalculate').checked) {
                    calculateCGPA();
                }
                
                // iOS fix - revert font size after selection
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '1.05rem';
                }
            });
            
            // Fix for iOS focus
            gradeSelect.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px';
                }
            });
            
            gradeSelect.addEventListener('blur', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '1.05rem';
                }
            });
            
            // Add event listener to delete button
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                const table = document.getElementById('coursesTableBody');
                if (table.children.length > 1) {
                    row.remove();
                    updateCourseNames();
                    if (document.getElementById('autoCalculate').checked) {
                        calculateCGPA();
                    }
                } else {
                    alert('You need at least one course. Try resetting instead.');
                }
            });
            
            return row;
        }
        
        // Function to update course names after deletion
        function updateCourseNames() {
            const rows = document.querySelectorAll('#coursesTableBody tr');
            rows.forEach((row, index) => {
                const courseNameInput = row.querySelector('.course-name');
                const gradeSelect = row.querySelector('.grade-select');
                
                // Only update if it's still a default name
                if (courseNameInput.value.startsWith('Course ')) {
                    courseNameInput.value = `Course ${index + 1}`;
                }
                courseNameInput.placeholder = `Course ${index + 1}`;
                
                // Update data-course attribute
                gradeSelect.setAttribute('data-course', index + 1);
            });
            
            // Update course counter
            courseCounter = rows.length;
            document.getElementById('totalCourses').textContent = courseCounter;
        }
        
        // Initialize with 3 default courses
        function initializeCourses() {
            const table = document.getElementById('coursesTableBody');
            table.innerHTML = '';
            
            for (let i = 1; i <= 3; i++) {
                const row = createCourseRow(i);
                table.appendChild(row);
            }
            
            courseCounter = 3;
            document.getElementById('totalCourses').textContent = courseCounter;
        }
        
        // Add Course Button
        document.getElementById('addCourse').addEventListener('click', function() {
            const table = document.getElementById('coursesTableBody');
            courseCounter++;
            const newRow = createCourseRow(courseCounter);
            table.appendChild(newRow);
            
            document.getElementById('totalCourses').textContent = courseCounter;
            
            if (document.getElementById('autoCalculate').checked) {
                calculateCGPA();
            }
        });
        
        // Reset All Button
        document.getElementById('resetAll').addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all courses and previous results? All data will be lost.')) {
                initializePreviousResult();
                initializeCourses();
                calculateCGPA();
            }
        });
        
        // Calculate Button
        document.getElementById('calculateBtn').addEventListener('click', calculateCGPA);
        
        // Auto-calculate checkbox
        document.getElementById('autoCalculate').addEventListener('change', function() {
            if (this.checked) {
                calculateCGPA();
            }
        });
        
        // Main calculation function
        function calculateCGPA() {
            const rows = document.querySelectorAll('#coursesTableBody tr');
            let currentTotalCredits = 0;
            let currentTotalGradePoints = 0;
            let validCourses = 0;
            
            // Calculate current courses CGPA
            rows.forEach(row => {
                const creditInput = row.querySelector('.credit');
                const gradeSelect = row.querySelector('.grade-select');
                
                const credit = parseFloat(creditInput.value) || 0;
                const selectedGrade = gradeSelect.value;
                const gradePoint = gradePoints[selectedGrade] || 0;
                
                // Validate inputs
                let isValid = true;
                
                if (creditInput.value.trim() !== '') {
                    if (credit < 0.5 || credit > 10 || isNaN(credit)) {
                        creditInput.classList.add('error');
                        isValid = false;
                    } else {
                        creditInput.classList.remove('error');
                    }
                }
                
                if (selectedGrade === '') {
                    gradeSelect.classList.add('error');
                    isValid = false;
                } else {
                    gradeSelect.classList.remove('error');
                }
                
                // Only calculate if both fields have values and are valid
                if (creditInput.value.trim() !== '' && selectedGrade !== '' && isValid) {
                    currentTotalCredits += credit;
                    currentTotalGradePoints += credit * gradePoint;
                    validCourses++;
                }
            });
            
            // Get previous result values
            const previousCgpaInput = document.querySelector('.previous-cgpa');
            const previousCreditsInput = document.querySelector('.previous-credits');
            
            const previousCgpa = parseFloat(previousCgpaInput.value) || 0;
            const previousCredits = parseFloat(previousCreditsInput.value) || 0;
            
            // Calculate current courses CGPA
            let currentCgpa = 0;
            if (currentTotalCredits > 0) {
                currentCgpa = currentTotalGradePoints / currentTotalCredits;
            }
            
            // Calculate previous total grade points
            const previousTotalGradePoints = previousCgpa * previousCredits;
            
            // Calculate overall CGPA
            let overallCgpa = 0;
            let totalCredits = previousCredits + currentTotalCredits;
            
            if (totalCredits > 0) {
                overallCgpa = (previousTotalGradePoints + currentTotalGradePoints) / totalCredits;
            } else if (previousCredits > 0) {
                // Only previous results exist
                overallCgpa = previousCgpa;
                totalCredits = previousCredits;
            } else if (currentTotalCredits > 0) {
                // Only current courses exist
                overallCgpa = currentCgpa;
                totalCredits = currentTotalCredits;
            }
            
            // Calculate percentage
            const percentage = (overallCgpa / 4.0) * 100;
            
            // Update UI
            document.getElementById('cgpaValue').textContent = overallCgpa.toFixed(2);
            document.getElementById('percentageValue').textContent = percentage.toFixed(0) + '%';
            document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
            document.getElementById('totalGradePoints').textContent = (previousTotalGradePoints + currentTotalGradePoints).toFixed(2);
            
            // Color indication for incomplete data
            if (validCourses < rows.length) {
                document.getElementById('cgpaValue').style.color = '#e74c3c';
                document.getElementById('percentageValue').style.color = '#e74c3c';
            } else {
                document.getElementById('cgpaValue').style.color = '#2c3e50';
                document.getElementById('percentageValue').style.color = '#27ae60';
            }
        }

