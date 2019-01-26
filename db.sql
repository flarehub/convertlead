-- MySQL Workbench Synchronization
-- Generated: 2019-01-26 21:12
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: dmitri

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `lead_aggregator`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;

ALTER TABLE `lead_aggregator`.`users` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
CHANGE COLUMN `name` `name` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `email` `email` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `role` `role` ENUM('NONE', 'ADMIN', 'AGENCY', 'COMPANY', 'AGENT') NULL DEFAULT NULL ,
CHANGE COLUMN `thumbnail` `thumbnail` VARCHAR(245) NULL DEFAULT NULL ;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`company_agents` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `agent_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_company_agents_1_idx` (`company_id` ASC) VISIBLE,
  INDEX `fk_company_agents_2_idx` (`agent_id` ASC) VISIBLE,
  CONSTRAINT `fk_company_agents_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_company_agents_2`
    FOREIGN KEY (`agent_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`agency_companies` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `agency_id` INT(11) NULL DEFAULT NULL,
  `company_id` INT(11) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_agency_companies_1_idx` (`agency_id` ASC) VISIBLE,
  INDEX `fk_agency_companies_2_idx` (`company_id` ASC) VISIBLE,
  CONSTRAINT `fk_agency_companies_1`
    FOREIGN KEY (`agency_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agency_companies_2`
    FOREIGN KEY (`company_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`leads` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(245) NULL DEFAULT NULL,
  `email` VARCHAR(245) NULL DEFAULT NULL,
  `phone` VARCHAR(245) NULL DEFAULT NULL,
  `metadata` JSON NULL,
  `status_id` INT(10) UNSIGNED NOT NULL,
  `deal_campaing_integration_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_leads_1_idx` (`deal_campaing_integration_id` ASC) VISIBLE,
  INDEX `fk_leads_2_idx` (`status_id` ASC) VISIBLE,
  CONSTRAINT `fk_leads_1`
    FOREIGN KEY (`deal_campaing_integration_id`)
    REFERENCES `lead_aggregator`.`deal_campaign_integrations` (`deal_campaign_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_leads_2`
    FOREIGN KEY (`status_id`)
    REFERENCES `lead_aggregator`.`lead_statuses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`deals` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(45) NULL DEFAULT NULL,
  `agency_company_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_deals_1_idx` (`agency_company_id` ASC) VISIBLE,
  CONSTRAINT `fk_deals_1`
    FOREIGN KEY (`agency_company_id`)
    REFERENCES `lead_aggregator`.`agency_companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`deal_campaigns` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(45) NULL DEFAULT NULL,
  `deal_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_deal_campaigns_1_idx` (`deal_id` ASC) VISIBLE,
  CONSTRAINT `fk_deal_campaigns_1`
    FOREIGN KEY (`deal_id`)
    REFERENCES `lead_aggregator`.`deals` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`deal_campaign_integrations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(245) NULL DEFAULT NULL,
  `deal_campaign_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `type` ENUM('NONE', 'FACEBOOK', 'ZIPPER', 'OPTIN_FORM') NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(245) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_deal_campaign_integrations_1_idx` (`deal_campaign_id` ASC) VISIBLE,
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  CONSTRAINT `fk_deal_campaign_integrations_1`
    FOREIGN KEY (`deal_campaign_id`)
    REFERENCES `lead_aggregator`.`deal_campaigns` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`deal_campaign_agents` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `deal_campaign_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `company_agent_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_deal_campaign_agents_1_idx` (`deal_campaign_id` ASC) VISIBLE,
  INDEX `fk_deal_campaign_agents_2_idx` (`company_agent_id` ASC) VISIBLE,
  CONSTRAINT `fk_deal_campaign_agents_1`
    FOREIGN KEY (`deal_campaign_id`)
    REFERENCES `lead_aggregator`.`deal_campaigns` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_deal_campaign_agents_2`
    FOREIGN KEY (`company_agent_id`)
    REFERENCES `lead_aggregator`.`company_agents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`lead_notes` (
  `id` INT(10) UNSIGNED NOT NULL,
  `lead_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `company_agent_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `status_id` INT(10) UNSIGNED NULL DEFAULT 'NONE',
  `message` VARCHAR(245) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_lead_history_1_idx` (`lead_id` ASC) VISIBLE,
  INDEX `fk_lead_history_2_idx` (`company_agent_id` ASC) VISIBLE,
  INDEX `fk_lead_history_3_idx` (`status_id` ASC) VISIBLE,
  CONSTRAINT `fk_lead_history_1`
    FOREIGN KEY (`lead_id`)
    REFERENCES `lead_aggregator`.`leads` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lead_history_2`
    FOREIGN KEY (`company_agent_id`)
    REFERENCES `lead_aggregator`.`company_agents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lead_history_3`
    FOREIGN KEY (`status_id`)
    REFERENCES `lead_aggregator`.`lead_statuses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`devices` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `agent_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `device_token` VARCHAR(245) NULL DEFAULT NULL,
  `type` ENUM('NONE', 'IOS', 'ANDROID', 'WEB', 'DESCKTOP') NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_devices_1_idx` (`agent_id` ASC) VISIBLE,
  CONSTRAINT `fk_devices_1`
    FOREIGN KEY (`agent_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`lead_statuses` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL DEFAULT NULL,
  `description` VARCHAR(1000) NULL DEFAULT NULL,
  `type` ENUM('NONE', 'VIEWED', 'CONTACTED_SMS', 'CONTACTED_CALL', 'CONTACTED_EMAIL', 'MISSED', 'BAD', 'SOLD') NULL DEFAULT 'NONE',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`permissions` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` ENUM('NONE', 'ALL', 'COMPANY_READ', 'COMPANY_WRITE', 'AGENCY_READ', 'AGENCY_WRITE', 'AGENT_READ', 'AGENT_WRITE', 'LEAD_READ', 'LEAD_WRITE') NULL DEFAULT 'NONE',
  `description` VARCHAR(245) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `lead_aggregator`.`user_permissions` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `permission_id` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_permissions_1_idx` (`permission_id` ASC) VISIBLE,
  INDEX `fk_user_permissions_2_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_permissions_1`
    FOREIGN KEY (`permission_id`)
    REFERENCES `lead_aggregator`.`permissions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_permissions_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `lead_aggregator`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `lead_aggregator`.`password_resets` ;

DROP TABLE IF EXISTS `lead_aggregator`.`oauth_refresh_tokens` ;

DROP TABLE IF EXISTS `lead_aggregator`.`oauth_personal_access_clients` ;

DROP TABLE IF EXISTS `lead_aggregator`.`oauth_clients` ;

DROP TABLE IF EXISTS `lead_aggregator`.`oauth_auth_codes` ;

DROP TABLE IF EXISTS `lead_aggregator`.`oauth_access_tokens` ;

DROP TABLE IF EXISTS `lead_aggregator`.`migrations` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
