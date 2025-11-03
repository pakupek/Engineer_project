import "./DamageHistory.css";
import ImageDamageShow from "../ImageDamageCreate";

export default function DamageHistoryForm({ damageEntries, handleDelete}){
    return(
        <div className="damage-history">
              <h2 className="history-title">Historia uszkodzeń</h2>
        
              <div className="damage-slider">
                {damageEntries.map((entry, index) => {
                  const markers = entry.markers || [];
                  const maxSeverity = markers.reduce((acc, m) => {
                    const order = { drobne: 1, umiarkowane: 2, poważne: 3 };
                    return order[m.severity] > order[acc] ? m.severity : acc;
                  }, "drobne");
        
                  return (
                    <div key={entry.id ?? `damage-${index}`} className="damage-slide">
                      <div className="damage-card">
                        <div className="damage-header">
                          <span className="damage-date">📅 {entry.date || "Brak daty"}</span>
                          <span
                            className={`damage-severity ${maxSeverity}`}
                          >
                            {maxSeverity}
                          </span>
                        </div>
        
                        <p className="damage-description">
                          {entry.description || "Brak opisu"}
                        </p>
        
                        <div className="damage-image">
                          <ImageDamageShow
                            src="https://previews.123rf.com/images/galimovma79/galimovma791605/galimovma79160500023/58812879-auto-linienziehbaren-versicherungssch%C3%A4den-zustand-form.jpg"
                            markers={markers}
                          />
                        </div>
        
                        <div className="actions">
                          <button onClick={() => handleDelete(entry.id)}>🗑 Usuń</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
    );
}