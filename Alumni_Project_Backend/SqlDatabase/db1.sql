-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 10:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumnus_bio`
--

DROP TABLE IF EXISTS `alumnus_bio`;
CREATE TABLE `alumnus_bio` (
  `id` int NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `batch` INT NOT NULL,
  `course_id` int NOT NULL,
  `email` varchar(250) NOT NULL,
  `connected_to` text NOT NULL,
  `avatar` text NOT NULL,
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '0= Unverified, 1= Verified',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `dob` date DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email_optional` varchar(255) DEFAULT NULL,
  `current_address` text DEFAULT NULL,
  `current_district_taluka` varchar(255) DEFAULT NULL,
  `village_name` varchar(255) DEFAULT NULL,
  `taluka` varchar(255) DEFAULT NULL,
  `other_taluka` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `other_district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `hostel` varchar(255) DEFAULT NULL,
  `year_of_joining_vss` INT DEFAULT NULL,
  `education_details` text DEFAULT NULL,
  `special_achievement` text DEFAULT NULL,
  `social_work` text DEFAULT NULL,
  `associated_with_samiti` varchar(10) DEFAULT NULL,
  `form_of_association` text DEFAULT NULL,
  `contribution_areas` text DEFAULT NULL,
  `reflection_on_samiti` text DEFAULT NULL,
  `additional_comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumnus_bio`
--

TRUNCATE TABLE `alumnus_bio`;
INSERT INTO `alumnus_bio` (`id`, `name`, `gender`, `batch`, `course_id`, `email`, `connected_to`, `avatar`, `status`, `date_created`, `dob`, `contact_number`, `email_optional`, `current_address`, `current_district_taluka`, `village_name`, `taluka`, `other_taluka`, `district`, `region`, `other_district`, `state`, `hostel`, `year_of_joining_vss`, `education_details`, `special_achievement`, `social_work`, `associated_with_samiti`, `form_of_association`, `contribution_areas`, `reflection_on_samiti`, `additional_comments`) VALUES
(37, 'Ram Vaidya', 'male', '2024', 15, 'ramvaidya@gmail.com', 'Wipro', 'Public\\Avatar\\image_1744796733597.png', 1, '2025-04-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 'Sameer Amarjinta', '', '0000', 11, 'sameeramarjinta@gmail.com', '', '', 1, '2025-04-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 'Krushna More', 'male', '2024', 11, 'Krushnamore@gmail.com', 'tcs', 'Public\\Avatar\\image_1744797914351.png', 1, '2025-04-16', '2003-01-31', '8180082758', '', 'gokhalenagar pune', 'mulshi', '', 'Baramati', '', 'Pune', 'west maharashtra', '', 'Maharashtra', 'lajpat ', '2021', 'bca in computer application', '', '', '', '', '', '', ''),
(42, 'Mangesh More', 'male', '2025', 17, 'mangesh@gmail.com', 'advocate at jaydeep law firm', 'Public\\Avatar\\image_1746546168815.jpeg', 1, '2025-04-17', '2003-09-02', '9604152695', 'mg@gmail.com', 'pune', 'pune', '', 'Koregaon', '', 'Satara', 'west maharashtra', '', 'Maharashtra', 'pd ', '2021', 'law', 'i am advocate at district court', 'i am volunteer at disha fundation', 'yes', 'i am donar', 'i want to give guidance a law student about practise', 'its nice place', 'nope'),
(43, 'Dj', '', '0000', 10, 'dj@gmail.com', '', '', 0, '2025-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'ramesh kadam', '', '0000', 12, 'ramesh@gmail.com', '', '', 0, '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 'alumni1', '', '2018', 7, 'alumni1@gmail.com', '', 'Public\\Avatar\\image_1746548793205.webp', 1, '2025-05-01', '1899-11-28', '', '', '', '', '', '', '', '', '', '', '', '', '0000', '', '', '', '', '', '', '', ''),
(47, 'Alumni Demo2', '', '0000', 10, 'alumnidemo2@gmail.com', '', '', 0, '2025-05-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 'Alumni Demo1', '', '0000', 7, 'alumnidemo1@gmail.com', '', '', 0, '2025-05-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
CREATE TABLE `careers` (
  `id` int NOT NULL PRIMARY KEY,
  `company` varchar(250) NOT NULL,
  `location` text NOT NULL,
  `job_title` text NOT NULL,
  `description` text NOT NULL,
  `user_id` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `careers`
--

TRUNCATE TABLE `careers`;
INSERT INTO `careers` (`id`, `company`, `location`, `job_title`, `description`, `user_id`, `date_created`) VALUES
(1, 'IT Company', 'Remote', 'Web Developer', '<p><strong><u>Lorem ipsum</u></strong> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ol><li><em> Sagittis eu volutpat odio facilisis mauris sit amet massa vitae.</em> In tellus integer feugiat scelerisque varius morbi enim. Orci eu lobortis elementum nibh tellus molestie nunc. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Eleifend donec pretium vulputate sapien nec. Enim praesent elementum facilisis leo vel fringilla est ullamcorper. Quam adipiscing vitae proin sagittis nisl rhoncus. Sed viverra ipsum nunc aliquet bibendum. Enim ut sem viverra aliquet eget sit amet tellus. Integer feugiat scelerisque varius morbi enim nunc faucibus.</li><li><em>Viverra justo nec ultrices dui. L</em>eo vel orci porta non pulvinar neque laoreet. Id semper risus in hendrerit gravida rutrum quisque non tellus. Sit amet consectetur adipiscing elit ut. Id neque aliquam vestibulum morbi blandit cursus risus. Tristique senectus et netus et malesuada.</li><li> <em>Amet aliquam id diam maecenas ultricies mi eget mauris. </em>Morbi tristique senectus et netus et malesuada. Diam phasellus vestibulum lorem sed risus. Tempor orci dapibus ultrices in. Mi sit amet mauris commodo quis imperdiet. Quisque sagittis purus sit amet volutpat. Vehicula ipsum a arcu cursus. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Id volutpat lacus laoreet non curabitur. Cursus euismod quis viverra nibh cras pulvinar mattis nunc. Id aliquet lectus proin nibh nisl condimentum id venenatis. Eget nulla facilisi etiam dignissim diam quis enim lobortis. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet.</li></ol>', 1, '2020-10-15 14:14:27'),
(2, 'Rana IT Company', 'ORIC, BZU', 'IT Specialist', '<p><strong><em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </em></strong><u>Sagittis eu volutpat odio facilisis mauris sit </u><em>amet massa vitae. In tellus integer feugiat scelerisque varius morbi enim. Orci eu lobortis elementum nibh tellus molestie nunc. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Eleifend donec pretium vulputate sapien nec. Enim praesent elementum facilisis leo vel fringilla est ullamcorper. Quam adipiscing vitae proin sagittis nisl rhoncus. Sed viverra ipsum nunc aliquet bibendum. Enim ut sem viverra aliquet eget sit amet tellus. Integer feugiat scelerisque varius morbi enim nunc faucibus.</em></p><p>Viverra justo nec ultrices dui. Leo vel orci porta non pulvinar neque laoreet. Id semper risus in hendrerit gravida rutrum quisque non tellus. Sit amet consectetur adipiscing elit ut. Id neque aliquam vestibulum morbi blandit cursus risus. Tristique senectus et netus et malesuada. Amet aliquam id diam maecenas ultricies mi eget mauris. Morbi tristique senectus et netus et malesuada. Diam phasellus vestibulum lorem sed risus. Tempor orci dapibus ultrices in. Mi sit amet mauris commodo quis imperdiet. Quisque sagittis purus sit amet volutpat. Vehicula ipsum a arcu cursus. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Id volutpat lacus laoreet non curabitur. Cursus euismod quis viv</p><ol><li>erra nibh cras pulvinar mattis nunc. Id aliquet lectus proin nibh nisl condimentum id venenatis. Eget nulla facilisi etiam dignissim</li></ol><ul><li>diam quis enim lobortis. Lacus suspendisse faucibus interdum p<em>osuere lorem ipsum dolor sit amet.</em></li></ul>', 1, '2020-10-15 15:05:37'),
(12, 'Capgemini', 'Airoli Knowledge Park Plot No.IT-1, IT-2, IT-1/PT, TTC Industrial Area, Thane-Belapur Road, Airoli, Navi Mumbai, NAVI MUMBAI, Maharashtra, India', ' Java Developer (Java Backend)', '<p><span style=\"color: rgb(71, 77, 106
);\">Capgemini is a global business and technology transformation partner, helping organizations to accelerate their dual transition to a digital and sustainable world, while creating tangible impact for enterprises and society. It is a responsible and diverse group of 340,000 team members in more than 50 countries. With its strong over 55-year heritage, Capgemini is trusted by its clients to unlock the value of technology to address the entire breadth of their business needs. It delivers end-to-end services and solutions leveraging strengths from strategy and design to engineering, all fueled by its market leading capabilities in AI, cloud and data, combined with its deep industry expertise and partner ecosystem. The Group reported 2023 global revenues of 22.5 billion (Euro).</span></p>', 37, '2025-04-11 13:05:59'),
(13, 'Oracle', 'Mumbai, Pune, Bengaluru', 'Java Technical Lead Core Java, J2EE, Spring, SQL', '<p>We work for one of the largest multi-national banks (Client) with presence across the globe. We work on Supply Chain Finance domain and is one of the industry leading solution for the Client. We are responsible for the enhancements to the existing platform to cater to the growing business needs based on industry trends, either functionally or technically.</p><p>The solution implemented is a global application spanning across 3 regions and 20+ countries with a single code base, with multi-lingual support.</p>', 37, '2025-04-11 13:11:52'),
(14, 'Virtusa', 'Bangalore, Chennai, Hyderabad, Pune, Mumbai, Gurugram', ' MLOps Azure + Azure Devops + Gen AI (Or) AI Azure', '<p><strong style=\"color: rgb(18, 18, 36);\">Hands On experience in DevOps and MLOps practices, with a focus on managing cloud-based machine learning environments.</strong></p><p><br></p><p><strong style=\"color: rgb(18, 18, 36);\">Model Deployment Build, optimize, and maintain cloud based environments for deploying, monitoring, and scaling machine learning models and data pipelines.</strong></p><p><br></p><p><strong style=\"color: rgb(18, 18, 36);\">Package machine learning models into Docker containers (Relative experience in ML models)</strong></p><p><strong style=\"color: rgb(18, 18, 36);\">Solid foundational knowledge of Azure Open AI and GPT LLM model fine-tuning techniques, with a strong grasp of prompt engineering principles.</strong></p><p><br></p><p><strong style=\"color: rgb(18, 18, 36);\">Develop and automate the unified CI/CD pipelines in Azure DevOps</strong></p><p><br></p><p><strong style=\"color: rgb(18, 18, 36);\">Hands-on experience in containerization and orchestration tools such as Docker and AKS</strong></p><p><br></p><p><strong style=\"color: rgb(18, 18, 36);\">Work closely with data scientists to ensure smooth handoffs and integration of machine learning models into production systems</strong></p><p><strong style=\"color: rgb(18, 18, 36);\">.</strong></p>', 37, '2025-04-11 13:14:36'),
(15, 'oasis infobyte', 'pune', 'web developer', '<p> front end developer with high skills on  design </p>', 38, '2025-04-11 18:34:31'),
(16, 'LTIMINDTREE', 'Shivajinagar, Pune', 'Software Developer', '<p>Skillable Person Required</p>', 38, '2025-04-11 22:34:59'),
(18, 'Mindprabha', 'Kothrud, Pune', 'Developer', '', 38, '2025-04-13 13:25:47'),
(21, 'tcs', 'Kothrud, Pune', 'Developer', '<p>add description here</p>', 52, '2025-04-19 14:16:52'),
(22, 'VLSI', 'shivajinagar,pune', 'developer', '<p>we want frontend developer</p>', 37, '2025-04-26 13:18:25'),
(23, 'VLSI', 'shivajinagar,pune', 'developer', '<p>we want frontend developer</p>', 37, '2025-04-26 13:18:33'),
(24, 'VLSI', 'shivajinagar,pune', 'developer', '<p>we want frontend developer</p>', 37, '2025-04-26 13:18:46'),
(25, 'VLSI', 'shivajinagar,pune', 'developer', '<p>we want frontend developer</p>', 37, '2025-04-26 13:18:51'),
(26, 'L&T', 'Kothrud, Pune', 'Developer', '<p>we want frontend developer</p>', 37, '2025-04-26 22:31:00'),
(27, 'Cyronics pvt ltd', 'Bhosari, Pune', 'RF Engineer', '<p>we are hiring!</p>', 52, '2025-04-29 18:17:18'),
(28, 'Agrita', 'pune', 'developer', '<p>i want frontend developer</p>', 52, '2025-04-29 20:56:47'),
(29, 'google', 'Bangalore, Chennai, Hyderabad, Pune, Mumbai, Gurugram', 'Developer', '<p>to develop semless software </p><p><br></p>', 52, '2025-05-06 01:32:30'),
(30, 'google ', 'pune', 'entc engineer', '<p>to create design of chips of semiconductor </p>', 56, '2025-05-06 22:33:06');

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
CREATE TABLE `connections` (
  `id` int NOT NULL PRIMARY KEY,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_connection` (`sender_id`,`receiver_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `connections`
--

TRUNCATE TABLE `connections`;
INSERT INTO `connections` (`id`, `sender_id`, `receiver_id`, `status`, `created_at`, `updated_at`) VALUES
(27, 56, 60, 'accepted', '2025-05-03 18:05:08', '2025-05-10 05:57:03'),
(28, 52, 60, 'accepted', '2025-05-03 18:06:36', '2025-05-03 18:06:52'),
(29, 52, 51, 'accepted', '2025-05-03 19:49:53', '2025-05-03 19:50:14'),
(30, 52, 50, 'accepted', '2025-05-05 05:15:30', '2025-05-05 05:16:08'),
(31, 56, 51, 'pending', '2025-05-06 16:00:08', '2025-05-06 16:00:08'),
(32, 60, 50, 'rejected', '2025-05-06 16:02:49', '2025-05-06 18:27:29'),
(33, 60, 56, 'rejected', '2025-05-06 16:03:57', '2025-05-06 18:20:10'),
(35, 56, 50, 'pending', '2025-05-06 17:17:03', '2025-05-06 17:17:03'),
(36, 52, 56, 'accepted', '2025-05-06 18:18:23', '2025-05-06 18:19:27'),
(37, 60, 51, 'pending', '2025-05-11 07:38:40', '2025-05-11 07:38:40'),
(38, 63, 52, 'accepted', '2025-05-11 18:52:19', '2025-05-11 18:53:25'),
(39, 64, 60, 'accepted', '2025-05-12 04:49:46', '2025-05-12 04:50:40'),
(40, 64, 52, 'pending', '2025-05-12 04:49:50', '2025-05-12 04:49:50'),
(41, 64, 56, 'pending', '2025-05-12 04:49:52', '2025-05-12 04:49:52'),
(42, 65, 64, 'pending', '2025-05-12 05:32:30', '2025-05-12 05:32:30'
);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int NOT NULL PRIMARY KEY,
  `course` text NOT NULL,
  `about` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

TRUNCATE TABLE `courses`;
INSERT INTO `courses` (`id`, `course`, `about`) VALUES
(7, 'public service ', ''),
(10, 'Medical ', ''),
(11, 'IT ', ''),
(12, 'Commerce', ''),
(13, 'Management ', ''),
(15, 'Science', ''),
(16, 'Arts', ''),
(17, 'Law', ''),
(18, 'Mechanical Engg', ''),
(19, 'Eletronics Engg', ''
);

-- --------------------------------------------------------

--
-- Table structure for table `deleted_messages_for_users`
--

DROP TABLE IF EXISTS `deleted_messages_for_users`;
CREATE TABLE `deleted_messages_for_users` (
  `id` int NOT NULL PRIMARY KEY,
  `message_id` int NOT NULL,
  `user_id` int NOT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  UNIQUE KEY `message_user_unique` (`message_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int NOT NULL PRIMARY KEY,
  `title` varchar(250) NOT NULL,
  `content` text NOT NULL,
  `schedule` datetime NOT NULL,
  `banner` text NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

TRUNCATE TABLE `events`;
INSERT INTO `events` (`id`, `title`, `content`, `schedule`, `banner`, `date_created`) VALUES
(10, 'The Future of AI in Creative Industries', '<p>This guest lecture explores how artificial intelligence is reshaping fields such as film, music, design, and literature. Join Dr. Maya Li, an AI ethicist and creative technologist from Stanford University, as she discusses emerging trends, ethical considerations, and how creatives can collaborate with AI tools to push boundaries. A Q&amp;A session will follow the presentation.</p>', '2025-04-16 17:24:00', '', '2025-04-11 13:21:56'),
(11, 'Climate Change and Urban Resilience', '<p>Urban planner and environmental scientist Dr. Carlos Mendez shares insights into how cities can adapt to the growing impacts of climate change. The session will focus on sustainable infrastructure, policy design, and real-world examples of resilient city models. Attendees will gain practical knowledge on building more adaptive urban environments.</p><p> <strong>Commited To Participate</strong>: Dr. Carlos Mendez – University of British Columbia</p>', '2025-04-30 17:25:00', '', '2025-04-11 13:22:38'),
(12, 'Cybersecurity in the Age of Quantum Computing', '<p>With quantum computing on the rise, what does this mean for modern cybersecurity? In this lecture, cybersecurity expert Rachel Okafor will dive into the potential threats and breakthroughs quantum technologies pose to data security. She'll also explore encryption strategies and what professionals can do to prepare for a post-quantum world.</p><p> <strong>Commited To Participate</strong>: Rachel Okafor – IBM Research</p>', '2025-04-17 17:25:00', '', '2025-04-11 13:23:02'),
(13, 'Design Thinking for Social Innovation', '<p>Join Prof. Elena Rossi as she walks through the principles of design thinking applied to social impact projects. This session will cover case studies where human-centered design has led to breakthrough solutions in education, healthcare, and community development. Participants will also engage in a short interactive ideation activity.</p>', '2025-04-21 18:26:00', '', '2025-04-11 13:23:54'),
(14, 'Blockchain Beyond Cryptocurrency', '<p>Blockchain isn\'t just about Bitcoin. Tech entrepreneur and MIT alumnus Sameer Patel delves into how blockchain technology is transforming industries like supply chain management, voting systems, healthcare, and intellectual property. The talk will include real-world use cases and a look at the road ahead.</p>', '2025-04-14 15:26:00', '', '2025-04-11 13:24:17'),
(15, 'Blockchain Beyond Cryptocurrency ', '<p>Blockchain isn\'t just about Bitcoin. Tech entrepreneur and MIT alumnus Sameer Patel delves into how blockchain technology is transforming industries like supply chain management, voting systems, healthcare, and intellectual property. The talk will include real-world use cases and a look at the road ahead.</p>', '2025-05-05 21:39:00', '', '2025-05-02 21:39:49'
);

-- --------------------------------------------------------

--
-- Table structure for table `event_commits`
--

DROP TABLE IF EXISTS `event_commits`;
CREATE TABLE `event_commits` (
  `id` int NOT NULL PRIMARY KEY,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_commits`
--

TRUNCATE TABLE `event_commits`;
INSERT INTO `event_commits` (`id`, `event_id`, `user_id`) VALUES
(12, 1, 2),
(13, 1, 1),
(14, 13, 43),
(15, 13, 37),
(16, 14, 43),
(17, 12, 43),
(18, 14, 38),
(19, 11, 43),
(20, 10, 52),
(21, 11, 52),
(22, 13, 52),
(23, 13, 53
);

-- --------------------------------------------------------

--
-- Table structure for table `forum_comments`
--

DROP TABLE IF EXISTS `forum_comments`;
CREATE TABLE `forum_comments` (
  `id` int NOT NULL PRIMARY KEY,
  `topic_id` int NOT NULL,
  `comment` text NOT NULL,
  `user_id` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_comments`
--

TRUNCATE TABLE `forum_comments`;
INSERT INTO `forum_comments` (`id`, `topic_id`, `comment`, `user_id`, `date_created`) VALUES
(27, 4, 'wow great... Hello world bro edited', 2, '2024-03-07 12:51:48'),
(28, 4, 'thats cool', 1, '2024-03-14 15:58:08'),
(34, 11, 'hii\n', 50, '2025-04-16 15:54:02'),
(35, 11, 'ram is there\n', 50, '2025-04-16 15:54:13'),
(36, 12, 'hi krushna ', 50, '2025-04-16 15:55:58'),
(37, 12, 'hii krushna\n', 51, '2025-04-16 16:00:13'),
(38, 11, 'hii\n', 53, '2025-04-16 16:15:06'),
(39, 10, 'hi', 37, '2025-04-19 14:05:29'),
(41, 13, 'we can comment here', 52, '2025-04-19 14:18:29'),
(42, 13, 'hi shubham this side ', 53, '2025-04-19 14:26:28'),
(43, 11, 'hi\n', 53, '2025-04-19 15:52:34'),
(45, 13, 'hello shubham', 52, '2025-04-27 00:58:33'),
(46, 13, 'hi sir', 53, '2025-04-27 00:59:15'),
(47, 13, 'hi sir how are you', 58, '2025-04-27 01:02:10'
);

-- --------------------------------------------------------

--
-- Table structure for table `forum_topics`
--

DROP TABLE IF EXISTS `forum_topics`;
CREATE TABLE `forum_topics` (
  `id` int NOT NULL PRIMARY KEY,
  `title` varchar(250) NOT NULL,
  `description` text NOT NULL,
  `user_id` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_topics`
--

TRUNCATE TABLE `forum_topics`;
INSERT INTO `forum_topics` (`id`, `title`, `description`, `user_id`, `date_created`) VALUES
(8, 'XAMPP Setup and Use Cases', '<p>XAMPP is meant only for development purposes. It's super helpful for testing PHP applications locally, but not ideal for live servers due to security settings. Share your tips, tricks, and challenges when working with XAMPP.</p>', 37, '2025-04-11 13:29:02'),
(9, 'Just Installed XAMPP—Now What?', '<p>You have successfully installed XAMPP on your system! Now it's time to explore Apache, MariaDB, and PHP. Here's a space for newcomers to ask questions, get started with local development, and troubleshoot setup issues.</p>', 37, '2025-04-11 13:29:50'),
(10, 'Getting the Most from XAMPP', '<p>From starting the control panel to configuring settings—this thread is for sharing guides, FAQs, and how-tos for setting up PHP applications. Also, feel free to link tutorials and your favorite YouTube walkthroughs.</p>', 37, '2025-04-11 13:30:04'),
(11, 'XAMPP Community and Resources', '<p>XAMPP has been around for over a decade and has a large community. This thread is all about connecting with other users, sharing plugins/extensions, and staying up to date with tools. Drop your favorite resources or social pages here.</p>', 37, '2025-04-11 13:30:17'),
(13, 'Alumni can add forum here', '<p>Add Description here</p>', 52, '2025-04-19 14:17:50'
);

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` int NOT NULL PRIMARY KEY,
  `image_path` varchar(255) NOT NULL,
  `about` text NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

TRUNCATE TABLE `gallery`;
INSERT INTO `gallery` (`id`, `image_path`, `about`, `created`) VALUES
(23, 'Public\\Images\\event.jpg', 'Join us for an electrifying day of innovation and inspiration at TechFusion 2025! This one-of-a-kind event brings together brilliant minds from the worlds of technology, entrepreneurship, and design. Dive into hands-on workshops, thought-provoking panel discussions, and networking sessions with industry leaders. Whether you're a student, developer, or curious mind, there's something here for everyone. Let's explore the future—together!', '2025-04-11 14:19:15'),
(25, 'Public\\Images\\vidyarathi melava.jpg', '36 वा माजी विद्यार्थी स्नेहमेळावा – आठवणी, प्रेरणा आणि नव्या संकल्पांचा उत्सव! ✨\r\n\r\nउत्साहाने भारावलेला हा सोहळा जुन्या आठवणींना उजाळा देणारा आणि नवीन संधींना दिशा देणारा ठरला! सहभागी झालेल्या सर्वांचे मनःपूर्वक आभार! ???? पुढच्या वर्षी अधिक उत्साहात पुन्हा भेटूया! ????', '2025-04-11 14:26:27'),
(26, 'Public\\Images\\mahila din.jpg', 'महिलांना जागतिक महिला दिनाच्या हार्दिक शुभेच्छा! ✨????\r\n\r\n#HappyWomensDay #WomenEmpowerment #WomensDay #EmpowerHer', '2025-04-11 14:26:49'),
(27, 'Public\\Images\\group.jpg', 'On the occasion of Marathi Bhasha Din, Vidyarthi Sahayyak Samiti organized a special literary event, "लेखक तुमच्या भेटीला", featuring Dr. Smita Nikhil Datar – a renowned General Physician, Aesthetician, and Author.\r\n\r\nThe session was an inspiring interaction filled with valuable insights, discussions on literature, and motivation for young minds. Thank you to everyone who joined and made this event memorable!\r\n\r\nStay tuned for more such enriching sessions! ????✨', '2025-04-11 14:27:18'),
(29, 'Public\\Images\\prashant.jpg', 'Proud Moment for Vidyarthi Sahayyak Samiti! ????✨\r\n\r\nOur students, Sushil Puri & Prashant Kadam, represented Samiti at the 98th Akhil Bharatiya Marathi Sahitya Sammelan, Delhi, and met Hon. Uday Samant Sir, Maharashtra's Cabinet Minister of Industries. ????????\r\n\r\nThey showcased Samiti's impactful work & invited him to visit us. A proud achievement! ????????', '2025-04-11 14:28:33'),
(30, 'Public\\Images\\group.jpg', 'Vidyarthi Sahayyak Samiti, in collaboration with Garje Marathi Global & Creative Coders, successfully conducted a two-day IoT & Python workshop for students.with hands-on experiments and expert guidance from Shrinivas Sir, the session provided valuable insights into real-world applications of IoT.\r\n\r\nA special thanks to Meenal Ma'am for her dedication in organizing this impactful program. Looking forward to more such knowledge-sharing initiatives! ????✨', '2025-04-11 14:28:58'
);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL PRIMARY KEY,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_text` text DEFAULT NULL,
  `read_status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_edited` tinyint DEFAULT 0,
  `edited_at` timestamp NULL DEFAULT NULL,
  `deleted_for_sender` tinyint DEFAULT 0,
  `deleted_for_receiver` tinyint DEFAULT 0,
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

TRUNCATE TABLE `messages`;
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message_text`, `read_status`, `created_at`, `is_edited`, `edited_at`, `deleted_for_sender`, `deleted_for_receiver`) VALUES
(109, 52, 50, 'hello', 'read', '2025-05-05 19:14:05', 0, NULL, 0, 0),
(110, 50, 52, 'hi how are you  ram', 'read', '2025-05-05 19:15:26', 1, NULL, 0, 0),
(111, 50, 52, 'ok now i want to see you ', 'read', '2025-05-05 19:38:09', 0, NULL, 1, 0),
(112, 50, 52, 'ok but when i can see you ', 'read', '2025-05-05 19:38:31', 0, NULL, 1, 1),
(114, 52, 50, 'hello how are you guys', 'read', '2025-05-05 19:43:27', 0, NULL, 0, 0),
(115, 50, 52, 'i am fine what about you ', 'read', '2025-05-05 19:43:51', 0, NULL, 0, 0),
(116, 50, 52, 'hello how are you krushana today ', 'read', '2025-05-06 11:51:34', 0, NULL, 0, 0),
(117, 50, 52, 'ok can you come to home today ', 'read', '2025-05-06 11:51:43', 0, NULL, 0, 0),
(118, 56, 52, 'Hello Krushna', 'read', '2025-05-08 17:01:57', 0, NULL, 0, 0),
(119, 60, 56, 'hi', 'read', '2025-05-11 07:39:03', 0, NULL, 0, 0
);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` int NOT NULL PRIMARY KEY,
  `name` text NOT NULL,
  `email` varchar(200) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `cover_img` text NOT NULL,
  `about_content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

TRUNCATE TABLE `system_settings`;
INSERT INTO `system_settings` (`id`, `name`, `email`, `contact`, `cover_img`, `about_content`) VALUES
(1, 'Alumni- VSS', 'info@samiti.org', '020-25533631', '1602738120_pngtree-purple-hd-business-banner-image_5493.jpg', 'Vidyarthi Sahayyak Samiti (SAMITI) is a non-Government charitable organization set up in 1955 at Pune (Maharashtra state / India) by Dr. Achyutrao Apte and his colleagues and provides lodging, boarding facilities at a nominal cost to students (boys and girls) from economically weaker section of society coming to Pune to pursue higher education.\r\nSAMITI also conducts various educational and other programmes aimed at personality development and character building for the benefit of the students.\r\nVidyarthi Sahayyak Samiti (Popularly knows as 'Samiti') is a public charitable trust located in Pune, Maharashtra state, India. Registration No : E 219 under section 50 A (3) of the Public Trusts Act 1950.'
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL PRIMARY KEY,
  `name` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT 'Alumnus' COMMENT 'Admin, Alumnus, Student',
  `auto_generated_pass` text NOT NULL,
  `alumnus_id` int NOT NULL,
  `grn_number` varchar(50) DEFAULT NULL COMMENT 'Applicable only for students',
  `hostel_name` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `batch` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `year_of_joining_vss` INT DEFAULT NULL,
  `education_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

TRUNCATE TABLE `users`;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `type`, `auto_generated_pass`, `alumnus_id`, `grn_number`, `hostel_name`, `gender`, `batch`, `dob`, `contact_number`, `avatar`, `course_id`, `year_of_joining_vss`, `education_details`) VALUES
(37, 'Yagnesh', 'admin@gmail.com', '$2b$10$lrtV9H7zKtErF/cJFJjKveBEwbcq/iRGpheI5/yKnGcEWlXxYPLWu', 'admin', '', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 'Ram Vaidya', 'laxmikantpatil7112@gmail.com\n', '$2b$10$CQOanrrpW3ppq8XaIp4qf.lCc44HgYApSs0dVFATuYzZIvLpXwI7K', 'alumnus', '', 37, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 'Sameer Amarjinta', 'samarthf28@gmail.com', '$2b$10$AV6Qg.Do/c.HEm1.f2qBpuoS3xYYtJQpCPeb.1.txDc4AKTlL16yq', 'alumnus', '', 38, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 'Krushna More', 'Krushnamore@gmail.com', '$2b$10$9NiZaElAId2Q3QzsjGCmE.6Gz.6vK13NIJSN9MwSduc8yoMDUKm5W', 'alumnus', '', 39, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 'Shubham Gundre', 'sp925039@gmail.com', '$2b$10$AVIL09..R8w1jAwWsdK4K.PruI.B0NMPlrn55rxxFmG9VIFRIusG6', 'student', '', 0, 'M22232341', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 'Mangesh More', 'mangesh@gmail.com', '$2b$10$roVuwzcMfSDNlo7A9w47HeC3uEn6aoeu1rnrYbhMAZao5zV9y6DGq', 'alumnus', '', 42, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'Dj', 'dj@gmail.com', '$2b$10$9P6Oe/3VOUCrVFZyTAVbCuN/X63TsAHUzEVjzV7hPnOYiFTCO/5ji', 'alumnus', '', 43, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 'student1', 'student1@gmail.com', '$2b$10$.7x4sX9/vh3Z.wejnJN5XO89R45urY09FrX7YFAnQIQnC5Ne61/Wi', 'student', '', 0, 'M12434345', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'ramesh kadam', 'ramesh@gmail.com', '$2b$10$3OKzQ0jq/gQikL8bzU2HBuuO7QzjqUrrV0WmmnYtvn.qJ1tv2e4EO', 'alumnus', '', 44, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'alumni1', 'alumni1@gmail.com', '$2b$10$izknbP57BEs2h3nSbYU3n.vzXJ60nP0yCaC/Y2QYFaCcJ9A1nPV5.', 'alumnus', '', 45, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 'prashant kadam', 'kadam@gmail.com', '$2b$10$bF5BRqGNJl2MZgDRkL.ifu0e006vGRBwaytwP5s.RY824qlS9s1Ii', 'student', '', 0, 'M22248965', 'PD Karkhanis', 'Male', '2023', '0000-00-00', '', NULL, 0, '2021', 'i am mechanical engineering in modern college of engineering '),
(63, 'yogesh pawar', 'yogesh@gmail.com', '$2b$10$z7EVeohs7ghrfac/VQeHouEFmpPMNAP4erOkbfmzYTKaB5x2NdYye', 'student', '', 0, 'M22258965', 'hp', 'Male', '2025', '2003-01-31', '9604152695', 'Public\\Avatar\\image_1746988284109.webp', 7, '2021', 'i am doing bsw in pvg '),
(65, 'Alumni Demo2', 'alumnidemo2@gmail.com', '$2b$10$5chpARKyy9p9QHm0rtuybut9FJ.Rx0iM6xXg9Pp/Byc2CHDz0c70O', 'alumnus', '', 47, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'Alumni Demo1', 'alumnidemo1@gmail.com', '$2b$10$6WlCxy96c8Uo9RvSgbfHOefSlE28.AYWJeq2qUaJmOSDRz9V4W34u', 'alumnus', '', 48, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 'Student Demo1', 'studentdemo1@gmail.com', '$2b$10$7lDYRhCri92lbZ83rQElIeqKuBEvKDUjWpplDoqELU.PDIx.5Y8HW', 'student', '', 0, 'M23345432', 'Haribhau Phatak', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 'Student Demo2', 'studentdemo2@gmail.com', '$2b$10$Yd/8BZlAOZ4GzkIQNKU47eOrllIdMJVOeXIqgm7G6cqXTnMCA4wcy', 'student', '', 0, 'M34565432', 'PD Karkhanis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
);

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `before_insert_user`;
DELIMITER $$
CREATE TRIGGER `before_insert_user` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  IF NEW.type = 'Student' THEN
    IF NEW.grn_number IS NOT NULL AND (CHAR_LENGTH(NEW.grn_number) != 9 OR NEW.grn_number NOT REGEXP '^[A-Za-z][0-9]{8}$') THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'GRN Number must be 9 characters: 1 letter followed by 8 digits';
    END IF;
  END IF;
END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS `only_one_admin_insert`;
DELIMITER $$
CREATE TRIGGER `only_one_admin_insert` BEFORE INSERT ON `users` FOR EACH ROW IF NEW.type = 'Admin' THEN
  IF (SELECT COUNT(*) FROM users WHERE type = 'Admin') >= 1 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Only one admin is allowed.';
  END IF;
END IF
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumnus_bio`
--
ALTER TABLE `alumnus_bio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `careers`
--
ALTER TABLE `careers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD UNIQUE KEY `unique_connection` (`sender_id`,`receiver_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deleted_messages_for_users`
--
ALTER TABLE `deleted_messages_for_users`
  ADD UNIQUE KEY `message_user_unique` (`message_id`,`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_commits`
--
ALTER TABLE `event_commits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forum_comments`
--
ALTER TABLE `forum_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forum_topics`
--
ALTER TABLE `forum_topics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumnus_bio`
--
ALTER TABLE `alumnus_bio`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `careers`
--
ALTER TABLE `careers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `deleted_messages_for_users`
--
ALTER TABLE `deleted_messages_for_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `event_commits`
--
ALTER TABLE `event_commits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `forum_comments`
--
ALTER TABLE `forum_comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `forum_topics`
--
ALTER TABLE `forum_topics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deleted_messages_for_users`
--
ALTER TABLE `deleted_messages_for_users`
  ADD CONSTRAINT `deleted_messages_for_users_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
