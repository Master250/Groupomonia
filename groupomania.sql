-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : Dim 25 avr. 2021 à 15:35
-- Version du serveur :  8.0.21
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` int UNSIGNED NOT NULL,
  `postId` int UNSIGNED NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comContent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comments_postId` (`postId`),
  KEY `fk_comments_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `userId`, `postId`, `date`, `comContent`) VALUES
(2, 3, 2, '2021-04-23 03:26:09', 'Lorem ipsum dolor sit amet consectetur adipisici\n'),
(7, 1, 3, '2021-04-23 16:40:32', 'c\'est cool!'),
(8, 1, 2, '2021-04-23 16:41:40', 'c\'est pas mal'),
(11, 1, 4, '2021-04-24 15:40:28', 'Bienvenue!!!!!!!'),
(12, 1, 5, '2021-04-25 14:17:00', 'Très jolie motif');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `postId` int UNSIGNED NOT NULL,
  `userId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `fk_like_postId` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `postId`, `userId`) VALUES
(2, 2, 3),
(3, 3, 1),
(5, 4, 1),
(6, 4, 2),
(7, 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` int UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `imageUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `date` datetime NOT NULL,
  `likes` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `userId`, `title`, `content`, `imageUrl`, `date`, `likes`) VALUES
(2, 2, 'Mon tout nouveau bébé!!!!!!!!!', ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto consectetur sint quo officia unde ipsam vitae in ratione nisi impedit molestias non totam magni cupiditate maxime labore, deserunt placeat maiores.', 'http://localhost:3000/images/images_(3)_1619344251864.jpg', '2021-04-23 02:19:18', 1),
(3, 3, 'Une année de virus', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto consectetur sint quo officia unde ipsam vitae in ratione nisi impedit molestias non totam magni cupiditate maxime labore, deserunt placeat maiores.\n', 'http://localhost:3000/images/images_(1)_1619140869341.jpg', '2021-04-23 03:21:09', 1),
(4, 3, 'Bientôt une année sans le père noêl', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit fugiat possimus, ad cupiditate quia ex incidunt eveniet blanditiis, vero, iure voluptas mollitia aperiam eos obcaecati doloremque voluptatum illum et corrupti.', 'http://localhost:3000/images/téléchargement_(1)_1619142447181.jpg', '2021-04-23 03:31:35', 2),
(5, 5, 'julllll', 'hop!!!!', 'http://localhost:3000/images/téléchargement_(2)_1619348103213.jpg', '2021-04-25 12:55:03', 1),
(6, 1, 'Mon dernier post', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sapiente ratione atque magnam ducimus commodi deserunt, laborum harum amet velit omnis, fugit, quasi beatae quisquam. Doloribus saepe dolorem adipisci minus!', 'http://localhost:3000/images/images_1619353343175.jpg', '2021-04-25 14:15:11', 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `moderator` int UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `lastName`, `firstName`, `email`, `avatar`, `password`, `moderator`) VALUES
(1, 'master', 'master', 'master@test.com', 'http://localhost:3000/avatars/images-1619145003022.jpg', '$2b$10$E9.FvBfDhu/JcyzQxTjsIOq6djutAVADLYlsnkyZkx/jtgqx.qUGW', 1),
(2, 'zaza', 'zaza', 'zaza@test.com', 'http://localhost:3000/avatars/images-1618532194566-1619144925563.png', '$2b$10$6iZjS0DLJ.CTB02w6kdrQuLIYBtyY5aCyhyxCvyoe8WHybrl/r1x6', NULL),
(3, 'paul', 'paul', 'paul@test.com', 'http://localhost:3000/avatars/icon-1619142612904.jpg', '$2b$10$8Xvn9MBfNXMrmHmw8TlXgu5J0W7Q.mJf4C2dvSb.0xIMqDHzvXWte', NULL),
(5, 'Martin', 'Martin', 'martin@test.com', 'http://localhost:3000/avatars/images-1619351034878.png', '$2b$10$Vq5XxDrcw3rG2FbT62.hLOucZb3htxAqCvHqsuAeXIC6CUPbb4v2S', NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
