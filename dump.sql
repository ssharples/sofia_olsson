SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."artists" ("id", "name", "bio", "avatar_url", "instagram_url", "twitter_url", "website_url", "created_at") VALUES
	('26ad1700-852f-43f2-9abe-46e8aa8596e3', 'Sofia Olsson', '', 'https://aflxjobceqjpjftxwewp.supabase.co/storage/v1/object/sign/eva/FLUX_00001_.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmEvRkxVWF8wMDAwMV8ucG5nIiwiaWF0IjoxNzM0MjE1NzEyLCJleHAiOjE3NjU3NTE3MTJ9.D4LmjF55KjBSwt2GPy4S36jDGjIcEiprC74nXF94E1c&t=2024-12-14T22%3A35%3A12.242Z', 'https://instagram.com/sofia_olsson_x', '', '', '2024-11-19 16:34:31.194359+00');


--
-- Data for Name: artworks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."artworks" ("id", "title", "description", "image_url", "price", "created_at", "artist_id") VALUES
	('37bb606d-f466-48b7-b15f-75fa8e5c1d0f', '', '', 'https://aflxjobceqjpjftxwewp.supabase.co/storage/v1/object/sign/eva/FLUX_00001_.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmEvRkxVWF8wMDAwMV8ucG5nIiwiaWF0IjoxNzM0MjE0MzQxLCJleHAiOjE3NjU3NTAzNDF9.9g3P23hs7u3-ruAxJlz2N-zSA15EV67QsyR73aZUT3E&t=2024-12-14T22%3A12%3A21.379Z', 1.99, '2024-11-19 16:34:31.194359+00', '26ad1700-852f-43f2-9abe-46e8aa8596e3'),
	('aa3acb01-62cf-4c45-9f8f-d9d925becc9b', '', '', 'https://aflxjobceqjpjftxwewp.supabase.co/storage/v1/object/sign/eva/FLUX_00009_.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmEvRkxVWF8wMDAwOV8ucG5nIiwiaWF0IjoxNzM0MjE0Mzg5LCJleHAiOjE3NjU3NTAzODl9.RHbZjUj_sdf2TPcSVWfDbUPxOiA84VpHULM6MRI8uV8&t=2024-12-14T22%3A13%3A09.519Z', 1.99, '2024-11-19 16:34:31.194359+00', '26ad1700-852f-43f2-9abe-46e8aa8596e3'),
	('bde6de05-44dd-4f78-a9c2-4c4025d88624', '', '', 'https://aflxjobceqjpjftxwewp.supabase.co/storage/v1/object/sign/eva/shoot_02.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmEvc2hvb3RfMDIucG5nIiwiaWF0IjoxNzM0MjE0NDE0LCJleHAiOjE3NjU3NTA0MTR9.ptwkTHxyjH2YaSOOJ0gvDKhysg1ozTJG4g5JniybP6M&t=2024-12-14T22%3A13%3A34.225Z', 1.99, '2024-11-19 16:34:31.194359+00', '26ad1700-852f-43f2-9abe-46e8aa8596e3');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: message_embeddings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: portfolio_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."portfolio_projects" ("id", "title", "artist", "genre", "description", "image_url", "audio_url", "featured", "created_at", "updated_at") VALUES
	('1e2ddeca-9bd0-4a95-bafe-2ce6a7d46c62', 'No Hablo', '5EB', 'Rap', 'Test', 'https://assets.audiomack.com/tml_vibez/917521b6e48d4c4933a038c8c75ad9469731bbf4e1855d80e5dce9ea0fa97cad.jpeg?width=600', 'https://www.dropbox.com/scl/fi/iec90t5qlqbf1u6tsb75x/Warm_hm_mixmaster_satti_1.4.wav?rlkey=087fajp5xqjgvy0ysg5j6snun&st=2mg31oto&dl=0', true, '2024-11-18 22:31:34+00', '2024-11-18 22:31:38+00');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."conversations_id_seq"', 1, false);


--
-- Name: message_embeddings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."message_embeddings_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
