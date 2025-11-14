-- Allows to check ALL the vehicles classification.
SELECT * FROM public.classification
ORDER BY classification_id ASC;

-- Allows to check ALL the vehicles inventory.
SELECT * FROM public.inventory
ORDER BY classification_id ASC;

-- Allows to check ALL the vehicles with their classification.
SELECT i.inv_id, i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
JOIN public.classification c ON i.classification_id = c.classification_id
ORDER BY i.inv_id;

-- Allows to check ALL the users (accounts)
SELECT * FROM public.account
ORDER BY account_id ASC;


SELECT * FROM public.classification;

SELECT * FROM public.inventory;

SELECT * FROM public.account;




UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

SELECT account_firstname, account_lastname, account_email, account_type
FROM public.account
WHERE account_email = 'tony@starkent.com';

DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

SELECT * FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Query 5th
SELECT
	i.inv_make,
	i.inv_model,
	c.classification_name
FROM
	public.inventory i
INNER JOIN
	public.classification c
ON
	i.classification_id = c.classification_id
WHERE
	c.classification_name = 'Sport';