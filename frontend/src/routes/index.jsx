// Menggabungkan rute dan menu dari tiap anggota tim.
// File ini jarang perlu diubah: tiap orang cukup mengedit routes file miliknya.
import * as nc from "./ncRoutes.jsx";
import * as ak from "./akRoutes.jsx";
import * as dk from "./dkRoutes.jsx";
import * as dkStaf from "./dkStafRoutes.jsx";
import { ROLE } from "../config/constants.js";

// dkStaf di depan: halaman Rekapitulasi DK didahulukan daripada placeholder di ncRoutes.
export const routeGroups = [dkStaf.routeGroup, nc.routeGroup, ak.routeGroup, dk.routeGroup];

export const navItems = [...nc.navItems, ...ak.navItems, ...dk.navItems, ...dkStaf.navItems];

// Halaman pertama setelah login, sesuai role.
export const halamanAwal = {
  [ROLE.STAF]: "/staf/dashboard",
  [ROLE.MAHASISWA]: "/layanan"
};
