import "./DamageHistory.css";
import ImageDamageShow from "../ImageDamage/ImageDamageCreate";

export default function DamageHistoryForm({ damageEntries, handleDelete, onEditDamage}){
  return(
    <div className="damage-history">
      <h2 className="history-title">Historia uszkodzeń</h2>

      {/* Slider z wpisami o uszkodzeniach */}
      {damageEntries.length > 0 ? (  
        <div className="damage-slider">
          {damageEntries.map((entry, index) => {
            const markers = entry.markers || [];
            const maxSeverity = markers.reduce((acc, m) => {
              const order = { 
                drobne: 1, 
                umiarkowane: 2, 
                poważne: 3 };
              return order[m.severity] > order[acc] ? m.severity : acc;
            }, "drobne");
          
            return (
              <div key={entry.id ?? `damage-${index}`} className="damage-slide">
                <div className="damage-card">
                  <div className="damage-header">

                    {/* Data i stopień uszkodzenia */}
                    <span className="damage-date">📅 {entry.date || "Brak daty"}</span>
                    <span className={`damage-severity ${maxSeverity}`}>
                      {maxSeverity}
                    </span>
                  </div>

                  {/* Opis uszkodzenia */}
                  <p className="damage-description">
                    {entry.description || "Brak opisu"}
                  </p>
          
                  {/* Obraz z lokalizacją uszkodzeń */}
                  <div className="damage-image">
                    <ImageDamageShow src="/images/auto-linienziehbaren.jpg" markers={markers}/>
                  </div>

                  {/* Miniatury zdjęć uszkodzeń */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="damage-photos-container">
                      {entry.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo.image || photo.url}
                          alt={`Uszkodzenie ${idx + 1}`}
                          className="damage-photo-thumb"
                        />
                      ))}
                    </div>
                  )}
          
                  {/* Akcje edycji/usuwania */}
                  <div className="actions">
                    <button className="delete-button" onClick={() => handleDelete(entry.id)}>🗑️ Usuń</button>
                    <button className="edit-button" onClick={() => onEditDamage(entry)}>✏️ Edytuj</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-entries">Brak wpisów o uszkodzeniach.</p>
      )}
    </div>
  );
}