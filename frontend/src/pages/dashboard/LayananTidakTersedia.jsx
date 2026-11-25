import "./LayananTidakTersedia.css";

// Ditampilkan setelah permintaan berhasil dan hasilnya kosong.
export default function LayananTidakTersedia({ searchedService = "", onReset }) {
  return (
            <section className="lu-empty-state">
              <div className="lu-empty-illustration">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="13"
                    y="10"
                    width="38"
                    height="44"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M23 23h18M23 31h18M23 39h10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="45"
                    cy="45"
                    r="9"
                    fill="#F5F9FF"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />

                  <path
                    d="m51.5 51.5 5 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3>
                {searchedService
                  ? `Layanan "${searchedService}" Belum Tersedia`
                  : "Layanan Tidak Ditemukan"}
              </h3>

              <p>
                {searchedService
                  ? `Maaf, layanan "${searchedService}" belum tersedia dalam sistem SAKTI FILKOM. Coba nama layanan atau kategori lain.`
                  : "Coba nama layanan atau kategori lain."}
              </p>

              <button
                type="button"
                className="lu-show-all-btn"
                onClick={onReset}
              >
                Tampilkan semua layanan
              </button>
            </section>
  );
}
