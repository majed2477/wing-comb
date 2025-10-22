CREATE TABLE `phone_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`countryCode` varchar(10) DEFAULT '+855',
	`ipAddress` varchar(45),
	`userAgent` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `phone_submissions_id` PRIMARY KEY(`id`)
);
