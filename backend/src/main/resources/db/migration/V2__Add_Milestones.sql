-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
    milestone_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    target_donor_count INT NOT NULL,
    achieved BOOLEAN NOT NULL DEFAULT FALSE,
    achieved_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    organization_id BIGINT NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Insert sample milestones for organization ID 1
INSERT INTO milestones (title, description, category, target_amount, target_donor_count, organization_id) VALUES
('First Education Milestone', 'First milestone for education sector', 'EDUCATION', 10000.00, 10, 1),
('Education Impact Milestone', 'Major impact in education', 'EDUCATION', 50000.00, 50, 1),
('Education Transformation', 'Transformative education funding', 'EDUCATION', 100000.00, 100, 1),

('First Healthcare Milestone', 'First milestone for healthcare sector', 'HEALTHCARE', 15000.00, 15, 1),
('Healthcare Impact Milestone', 'Major impact in healthcare', 'HEALTHCARE', 75000.00, 75, 1),
('Healthcare Transformation', 'Transformative healthcare funding', 'HEALTHCARE', 150000.00, 150, 1),

('First Food Milestone', 'First milestone for food security', 'FOOD', 5000.00, 25, 1),
('Food Security Impact', 'Major impact in food security', 'FOOD', 25000.00, 125, 1),
('Food Security Transformation', 'Transformative food security funding', 'FOOD', 100000.00, 500, 1);
