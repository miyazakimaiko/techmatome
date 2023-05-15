CREATE TABLE subscriber (
	email_address varchar(255) NOT NULL PRIMARY KEY,
	verified int DEFAULT 0 NOT NULL,
	tech_subscribed int NOT NULL,
	web_subscribed int NOT NULL,
	ai_subscribed int NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verification_token (
  email_address varchar(255),
  encrypted_token text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (email_address, encrypted_token),
	FOREIGN KEY (email_address) REFERENCES subscriber(email_address) ON DELETE CASCADE
);

INSERT INTO subscriber
VALUES (
	'test@test.com',
	0,
	1,
	0,
	0
)