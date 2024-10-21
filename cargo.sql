SET GLOBAL event_scheduler = ON;
CREATE EVENT deleteZeroQuantityCargo
ON SCHEDULE EVERY 10 MINUTE
DO
DELETE FROM cargo WHERE quantity = 0;
