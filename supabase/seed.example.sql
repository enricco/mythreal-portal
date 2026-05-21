-- Sample seed for a test client. Copy and adapt per real client.
-- Replace 'waypoint' with the real slug before running.

insert into clients (slug, name, passcode, brand_bio) values
  ('waypoint', 'Waypoint', 'waypoint-vibe-2026',
   'Waypoint is a [one-sentence positioning statement here].');

-- Capture the client_id for the inserts below
do $$
declare cid uuid;
begin
  select id into cid from clients where slug = 'waypoint';

  insert into portal_config (client_id) values (cid);

  insert into brand_colors (client_id, name, hex, rgb, hsl, role, sort_order) values
    (cid, 'Cream',  '#F4EFE6', 'rgb(244, 239, 230)', 'hsl(38, 35%, 93%)', 'primary',   1),
    (cid, 'Ember',  '#2B1F1A', 'rgb(43, 31, 26)',    'hsl(18, 25%, 14%)', 'secondary', 2),
    (cid, 'Amber',  '#D97706', 'rgb(217, 119, 6)',   'hsl(32, 95%, 44%)', 'accent',    3),
    (cid, 'Mist',   '#E8E3D9', 'rgb(232, 227, 217)', 'hsl(40, 19%, 88%)', 'neutral',   4);

  insert into brand_fonts (client_id, role, family, weights, css_import_url) values
    (cid, 'headline', 'Fraunces', '{400,600,800}',
     'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;800&display=swap'),
    (cid, 'body',     'Inter',    '{400,500,700}',
     'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

  insert into vibe_coordinates
    (client_id, code, label, surface_pct, weight_pct, accent_pct,
     surface_name, weight_name, accent_name, description, applied_examples) values
    (cid, 'V4', 'The Cinematic Operator', 80, 17, 3,
     'Cream', 'Ember', 'Amber',
     'Operational warmth. Cream dominates, ember grounds, amber sparks tension.',
     '[
       {"ratio":"80% surface","meaning":"dominant whitespace, breathing room","example":"homepage backgrounds, deck slides"},
       {"ratio":"17% weight","meaning":"warm dark elements anchor the layout","example":"headlines, nav, card backgrounds"},
       {"ratio":"3% accent","meaning":"tension points that draw attention","example":"CTAs, hover states, underlines"}
     ]'::jsonb);

  insert into verbal_examples (client_id, say_this, dont_say_this, context) values
    (cid, 'We''re shipping the update today.', 'Excited to announce we are rolling out a new release!', 'linkedin'),
    (cid, 'Get a demo', 'Schedule your personalized walkthrough', 'cta'),
    (cid, 'Quick question on the brief.', 'Reaching out to circle back on the brief.', 'email');

  insert into developer_tokens (client_id, token_block) values
    (cid,
':root {
  --color-cream: #F4EFE6;
  --color-ember: #2B1F1A;
  --color-amber: #D97706;
  --color-mist:  #E8E3D9;

  --font-headline: "Fraunces", serif;
  --font-body:     "Inter", sans-serif;
}');
end $$;
