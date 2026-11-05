// Paws and Play Town — service worker (offline cache for the installed web app).
//
// NETWORK FIRST: when the phone is online it always fetches the newest files
// (so a new build shows up on the next open) and keeps a copy; when offline
// it plays from that copy.
//
// VERSION is stamped automatically by publish.ps1 on every publish. A new
// version makes the phone install this worker fresh and throw away old copies.
const VERSION = '20261105-234118';
const CACHE = 'paws-play-town-' + VERSION;

// The page itself + the icon/manifest, so the app opens offline straight away.
// Everything else (scripts, art) is cached the first time the game loads it.
const CORE = ['./', './index.html', './manifest.webmanifest', './css/main.css'];
// Every script and art file the game uses — filled in by publish.ps1 so the
// whole game is saved on the very first visit. (Empty when run locally.)
const PRECACHE = ["./js/game.js","./index.html","./css/main.css","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./art/char.dog_d01.face_cold.webp","./art/char.dog_d01.face_cup_rim_contact.webp","./art/char.dog_d01.face_disgust.webp","./art/char.dog_d01.face_dizzy.webp","./art/char.dog_d01.face_food_refusal.webp","./art/char.dog_d01.face_hot_pant.webp","./art/char.dog_d01.face_hungry.webp","./art/char.dog_d01.face_laugh.webp","./art/char.dog_d01.face_neutral.webp","./art/char.dog_d01.face_open_for_spoon.webp","./art/char.dog_d01.face_pre_sneeze_nose.webp","./art/char.dog_d01.face_proud.webp","./art/char.dog_d01.face_scared.webp","./art/char.dog_d01.face_sleepy.webp","./art/char.dog_d01.face_smile.webp","./art/char.dog_d01.face_sneeze.webp","./art/char.dog_d01.face_suction_cheeks.webp","./art/char.dog_d01.face_surprised.webp","./art/char.dog_d01.fit_bp_cuff_front_socket.webp","./art/char.dog_d01.fit_bp_cuff_rear.webp","./art/char.dog_d01.fit_cheek_spot.webp","./art/char.dog_d01.fit_dental_bib.webp","./art/char.dog_d01.fit_dental_glasses.webp","./art/char.dog_d01.fit_forehead_bump.webp","./art/char.dog_d01.fit_forepaw_bandage.webp","./art/char.dog_d01.fit_forepaw_scrape.webp","./art/char.dog_d01.fit_forepaw_splinter.webp","./art/char.dog_d01.fit_lab_goggles.webp","./art/char.dog_d01.fit_reward_plaster.webp","./art/char.dog_d01.fit_scrape_plaster.webp","./art/char.dog_d01.master_full.webp","./art/char.dog_d01.part_eye_closed_l.webp","./art/char.dog_d01.part_eye_closed_r.webp","./art/char.dog_d01.part_eye_white_l.webp","./art/char.dog_d01.part_eye_white_r.webp","./art/char.dog_d01.part_foot_l.webp","./art/char.dog_d01.part_foot_r.webp","./art/char.dog_d01.part_forearm_l.webp","./art/char.dog_d01.part_forearm_r.webp","./art/char.dog_d01.part_iris_pupil_l.webp","./art/char.dog_d01.part_iris_pupil_r.webp","./art/char.dog_d01.part_lower_leg_l.webp","./art/char.dog_d01.part_lower_leg_r.webp","./art/char.dog_d01.part_paw_l.webp","./art/char.dog_d01.part_paw_r.webp","./art/char.dog_d01.part_tail.webp","./art/char.dog_d01.part_thigh_l.webp","./art/char.dog_d01.part_thigh_r.webp","./art/char.dog_d01.part_torso.webp","./art/char.dog_d01.part_upper_arm_l.webp","./art/char.dog_d01.part_upper_arm_r.webp","./art/char.dog_d01.pose_sit_chair.webp","./art/container.medical_bag_front.webp","./art/container.medical_bag_open.webp","./art/fx.burst_bubble_ring.webp","./art/fx.confetti_burst.webp","./art/fx.curved_motion_lines.webp","./art/fx.dental_curing_lamp_beam.webp","./art/fx.dropper_droplet.webp","./art/fx.fizzy_bottle_foam_spout.webp","./art/fx.green_stink_puff.webp","./art/fx.single_soap_bubble.webp","./art/fx.small_splash_crown.webp","./art/fx.sneeze_burst.webp","./art/fx.static_spark.webp","./art/fx.steam_curl.webp","./art/fx.toast_crumb_scatter.webp","./art/hint.cool_head_bump.webp","./art/hint.ear_temperature.webp","./art/hint.follow_eye_light.webp","./art/hint.lift_splinter.webp","./art/hint.listen_heartbeat.webp","./art/hint.look_inside_ear.webp","./art/hint.plaster_scrape.webp","./art/hint.reward_sticker.webp","./art/hint.squeeze_pressure_bulb.webp","./art/hint.tap_knee_reflex.webp","./art/hint.wrap_paw.webp","./art/obj.023.webp","./art/obj.024.webp","./art/obj.025.webp","./art/obj.026.bulb.webp","./art/obj.026.needle.webp","./art/obj.027.webp","./art/obj.028.webp","./art/obj.029.webp","./art/obj.030.webp","./art/obj.031.webp","./art/obj.032.webp","./art/obj.032.inflated.webp","./art/obj.033.webp","./art/obj.034.webp","./art/obj.035.webp","./art/obj.036.webp","./art/obj.037.webp","./art/obj.038.webp","./art/obj.038.fill.webp","./art/obj.039.webp","./art/obj.041.webp","./art/ui.back_to_menu.webp","./art/ui.cancel.webp","./art/ui.confirm.webp","./art/ui.enter_doorway.webp","./art/ui.grown_ups.webp","./art/ui.music.webp","./art/ui.patient_card.webp","./art/ui.picture_hint.webp","./art/ui.reduce_motion.webp","./art/ui.reset_room.webp","./art/ui.reset_town.webp","./art/ui.selection_ring.webp","./art/ui.settings.webp","./art/ui.sound_effects.webp","./art/ui.town_map.webp","./art/ui.undo.webp","./art/ui.volume_knob.webp","./art/ui.volume_track.webp"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // One file failing (e.g. art still being re-filed) must not block the rest.
      .then((c) => Promise.allSettled(CORE.concat(PRECACHE).map((u) =>
        c.add(new Request(u, { cache: 'reload' })))))
      .catch(() => { /* offline during install: runtime caching will fill in */ })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('paws-play-town-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
