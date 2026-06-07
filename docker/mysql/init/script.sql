-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema teste_receitas_rg_sistemas
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema teste_receitas_rg_sistemas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `teste_receitas_rg_sistemas` ;
USE `teste_receitas_rg_sistemas` ;

-- -----------------------------------------------------
-- Table `teste_receitas_rg_sistemas`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_receitas_rg_sistemas`.`usuarios` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '\n',
  `nome` VARCHAR(100) NULL,
  `login` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_receitas_rg_sistemas`.`categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_receitas_rg_sistemas`.`categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_receitas_rg_sistemas`.`receitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_receitas_rg_sistemas`.`receitas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuarios` INT(10) UNSIGNED NOT NULL,
  `id_categorias` INT(10) UNSIGNED NULL,
  `nome` VARCHAR(45) NULL,
  `tempo_preparo_minutos` INT UNSIGNED NULL,
  `porcoes` INT UNSIGNED NULL,
  `modo_preparo` TEXT NOT NULL,
  `ingredientes` TEXT NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_receitas_1_idx` (`id_usuarios` ASC),
  INDEX `fk_receitas_2_idx` (`id_categorias` ASC),
  CONSTRAINT `fk_receitas_1`
    FOREIGN KEY (`id_usuarios`)
    REFERENCES `teste_receitas_rg_sistemas`.`usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_receitas_2`
    FOREIGN KEY (`id_categorias`)
    REFERENCES `teste_receitas_rg_sistemas`.`categorias` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `teste_receitas_rg_sistemas`.`categorias`
-- -----------------------------------------------------
START TRANSACTION;
USE `teste_receitas_rg_sistemas`;
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (1, 'Bolos e tortas doces');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (2, 'Carnes');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (3, 'Aves');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (4, 'Peixes e frutos do mar');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (5, 'Saladas, molhos e acompanhamentos');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (6, 'Sopas');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (7, 'Massas');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (8, 'Bebidas');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (9, 'Doces e sobremesas');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (10, 'Lanches');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (11, 'Prato Único');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (12, 'Light');
INSERT INTO `teste_receitas_rg_sistemas`.`categorias` (`id`, `nome`) VALUES (13, 'Alimentação Saudável');

COMMIT;

