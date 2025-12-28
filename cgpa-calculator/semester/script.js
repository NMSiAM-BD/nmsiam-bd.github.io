
        // Initialize with 3 courses when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeCourses();
            calculateCGPA();
        });
        
        let courseCounter = 3;
        
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
                    <input type="number" class="course-input grade-point" 
                           placeholder="0.0" 
                           min="0.0" max="4.0" step="0.1">
                </td>
                <td class="action-cell">
                    <button class="delete-btn" title="Delete Course">
                        <span class="delete-icon">×</span>
                    </button>
                </td>
            `;
            
            // Add event listeners to inputs
            const inputs = row.querySelectorAll('.course-input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Remove error class when user starts typing
                    this.classList.remove('error');
                    
                    if (document.getElementById('autoCalculate').checked) {
                        calculateCGPA();
                    }
                });
            });
            
            // Add event listener to delete button
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                const table = document.getElementById('coursesTable');
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
            const rows = document.querySelectorAll('#coursesTable tr');
            rows.forEach((row, index) => {
                const courseNameInput = row.querySelector('.course-name');
                // Only update if it's still a default name
                if (courseNameInput.value.startsWith('Course ')) {
                    courseNameInput.value = `Course ${index + 1}`;
                }
                courseNameInput.placeholder = `Course ${index + 1}`;
            });
            
            // Update course counter
            courseCounter = rows.length;
            document.getElementById('totalCourses').textContent = courseCounter;
        }
        
        // Initialize with 3 default courses
        function initializeCourses() {
            const table = document.getElementById('coursesTable');
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
            const table = document.getElementById('coursesTable');
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
            if (confirm('Are you sure you want to reset all courses? All data will be lost.')) {
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
            const rows = document.querySelectorAll('#coursesTable tr');
            let totalCredits = 0;
            let totalGradePoints = 0;
            let validCourses = 0;
            
            rows.forEach(row => {
                const creditInput = row.querySelector('.credit');
                const gradeInput = row.querySelector('.grade-point');
                
                const credit = parseFloat(creditInput.value) || 0;
                const gradePoint = parseFloat(gradeInput.value) || 0;
                
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
                
                if (gradeInput.value.trim() !== '') {
                    if (gradePoint < 0.0 || gradePoint > 4.0 || isNaN(gradePoint)) {
                        gradeInput.classList.add('error');
                        isValid = false;
                    } else {
                        gradeInput.classList.remove('error');
                    }
                }
                
                // Only calculate if both fields have values and are valid
                if (creditInput.value.trim() !== '' && gradeInput.value.trim() !== '' && isValid) {
                    totalCredits += credit;
                    totalGradePoints += credit * gradePoint;
                    validCourses++;
                }
            });
            
            // Calculate CGPA
            let cgpa = 0;
            if (totalCredits > 0) {
                cgpa = totalGradePoints / totalCredits;
            }
            
            // Calculate percentage
            const percentage = (cgpa / 4.0) * 100;
            
            // Update UI
            document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
            document.getElementById('percentageValue').textContent = percentage.toFixed(0) + '%';
            document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
            document.getElementById('totalGradePoints').textContent = totalGradePoints.toFixed(2);
            
            // Color indication for incomplete data
            if (validCourses < rows.length) {
                document.getElementById('cgpaValue').style.color = '#e74c3c';
                document.getElementById('percentageValue').style.color = '#e74c3c';
            } else {
                document.getElementById('cgpaValue').style.color = '#2c3e50';
                document.getElementById('percentageValue').style.color = '#27ae60';
            }
        }
