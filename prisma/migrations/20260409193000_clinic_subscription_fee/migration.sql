-- Add persistent monthly subscription fee for each clinic
ALTER TABLE `Clinic`
  ADD COLUMN `subscription_fee` DECIMAL(10, 2) NOT NULL DEFAULT 50.00;
