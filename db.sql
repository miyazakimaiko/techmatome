CREATE TABLE subscriber (
	email_address varchar(255) NOT NULL PRIMARY KEY,
	verified int DEFAULT 0 NOT NULL,
	tech_subscribed int NOT NULL,
	web_subscribed int NOT NULL,
	ai_subscribed int NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscriber
VALUES (
	'test@test.com',
	0,
	1,
	0,
	0
)