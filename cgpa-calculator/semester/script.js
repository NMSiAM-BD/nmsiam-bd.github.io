
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize with 3 default course rows
            initializeCourses();
            calculateCGPA();
            
            // Function to create a course row
            function createCourseRow(courseNum) {
                const row = document.createElement('tr');
                row.dataset.id = Date.now() + Math.random(); // Unique ID for each row
                
                row.innerHTML = `
                    <td>
                        <input type="text" class="course-name" placeholder="Course ${courseNum}" value="Course ${courseNum}">
                    </td>
                    <td>
                        <input type="number" class="credit" min="0.5" max="10" step="0.5" placeholder="3" value="">
                    </td>
                    <td>
                        <input type="number" class="grade-point" min="0.0" max="4.0" step="0.1" placeholder="0.0" value="">
                    </td>
                    <td>
                        <button class="action-btn delete-btn" title="Delete Course">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                
                // Add event listeners to inputs
                const inputs = row.querySelectorAll('input');
                inputs.forEach(input => {
                    input.addEventListener('input', function() {
                        // Remove error class when user starts typing
                        this.classList.remove('error-input');
                        
                        if (document.getElementById('autoCalculate').checked) {
                            calculateCGPA();
                        }
                    });
                    
                    // Validate on blur
                    input.addEventListener('blur', function() {
                        validateInput(this);
                        if (document.getElementById('autoCalculate').checked) {
                            calculateCGPA();
                        }
                    });
                });
                
                // Add event listener to delete button
                row.querySelector('.delete-btn').addEventListener('click', function() {
                    if (document.getElementById('coursesTable').children.length > 1) {
                        row.remove();
                        updateCourseNames();
                        if (document.getElementById('autoCalculate').checked) {
                            calculateCGPA();
                        }
                    } else {
                        alert('You must have at least one course. You can reset it instead.');
                    }
                });
                
                return row;
            }
            
            // Function to validate individual input
            function validateInput(input) {
                if (input.classList.contains('credit')) {
                    const value = parseFloat(input.value);
                    if (input.value.trim() !== '' && (value < 0.5 || value > 10 || isNaN(value))) {
                        input.classList.add('error-input');
                        return false;
                    }
                } else if (input.classList.contains('grade-point')) {
                    const value = parseFloat(input.value);
                    if (input.value.trim() !== '' && (value < 0.0 || value > 4.0 || isNaN(value))) {
                        input.classList.add('error-input');
                        return false;
                    }
                }
                input.classList.remove('error-input');
                return true;
            }
            
            // Function to update course names
            function updateCourseNames() {
                const rows = document.querySelectorAll('#coursesTable tr');
                rows.forEach((row, index) => {
                    const courseNameInput = row.querySelector('.course-name');
                    if (courseNameInput.value.startsWith('Course ')) {
                        courseNameInput.value = `Course ${index + 1}`;
                    }
                    courseNameInput.placeholder = `Course ${index + 1}`;
                });
            }
            
            // Initialize with 3 default courses
            function initializeCourses() {
                const table = document.getElementById('coursesTable');
                table.innerHTML = '';
                
                for (let i = 1; i <= 3; i++) {
                    const row = createCourseRow(i);
                    table.appendChild(row);
                }
                
                document.getElementById('totalCourses').textContent = table.children.length;
            }
            
            // Add Course Button
            document.getElementById('addCourse').addEventListener('click', function() {
                const table = document.getElementById('coursesTable');
                const courseCount = table.children.length + 1;
                const newRow = createCourseRow(courseCount);
                
                table.appendChild(newRow);
                document.getElementById('totalCourses').textContent = table.children.length;
                
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
                    
                    // Validate inputs first
                    const creditValid = validateInput(creditInput);
                    const gradeValid = validateInput(gradeInput);
                    
                    const credit = parseFloat(creditInput.value) || 0;
                    const gradePoint = parseFloat(gradeInput.value) || 0;
                    
                    // Only add to calculation if both fields are valid and not empty
                    if (creditInput.value.trim() !== '' && gradeInput.value.trim() !== '' && creditValid && gradeValid) {
                        if (credit >= 0.5 && credit <= 10 && gradePoint >= 0 && gradePoint <= 4.0) {
                            totalCredits += credit;
                            totalGradePoints += credit * gradePoint;
                            validCourses++;
                        }
                    }
                });
                
                // Calculate CGPA
                let cgpa = 0;
                if (totalCredits > 0) {
                    cgpa = totalGradePoints / totalCredits;
                }
                
                // Calculate percentage (assuming 4.0 scale)
                const percentage = (cgpa / 4.0) * 100;
                
                // Update UI
                document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
                document.getElementById('percentageValue').textContent = percentage.toFixed(0) + '%';
                document.getElementById('totalCourses').textContent = rows.length;
                document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
                document.getElementById('totalGradePoints').textContent = totalGradePoints.toFixed(2);
                
                // Show warning if not all courses have valid data
                if (validCourses < rows.length) {
                    document.getElementById('cgpaValue').style.color = '#e74c3c';
                    document.getElementById('percentageValue').style.color = '#e74c3c';
                } else {
                    document.getElementById('cgpaValue').style.color = '#2c3e50';
                    document.getElementById('percentageValue').style.color = '#27ae60';
                }
            }
        });
    
