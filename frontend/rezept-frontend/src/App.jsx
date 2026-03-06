import { useState, useEffect } from "react"

const styles = {
  body: {
    margin: 0,
    fontFamily: "'Georgia', serif",
    background: "#faf7f2",
    minHeight: "100vh",
  },
  header: {
    background: "#1a1a1a",
    color: "#f5e6c8",
    padding: "2rem 3rem",
    borderBottom: "4px solid #c8a96e",
  },
  headerTitle: {
    margin: 0,
    fontSize: "2.5rem",
    letterSpacing: "0.05em",
    fontWeight: "normal",
  },
  headerSub: {
    margin: "0.3rem 0 0",
    color: "#c8a96e",
    fontSize: "0.95rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "2rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8ddd0",
    borderRadius: "4px",
    padding: "1.8rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardTitle: {
    margin: "0 0 0.3rem",
    fontSize: "1.4rem",
    color: "#1a1a1a",
    fontWeight: "normal",
  },
  origin: {
    color: "#c8a96e",
    fontSize: "0.8rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 1rem",
  },
  description: {
    color: "#666",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    borderLeft: "3px solid #e8ddd0",
    paddingLeft: "1rem",
    margin: "0 0 1.2rem",
  },
  sectionTitle: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#999",
    margin: "1.2rem 0 0.5rem",
  },
  ingredientList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  ingredientTag: {
    background: "#faf7f2",
    border: "1px solid #e8ddd0",
    borderRadius: "2px",
    padding: "0.2rem 0.6rem",
    fontSize: "0.85rem",
    color: "#555",
  },
  instructions: {
    color: "#444",
    fontSize: "0.9rem",
    lineHeight: "1.7",
    margin: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.2rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e8ddd0",
    color: "#999",
    fontSize: "0.8rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
    fontSize: "1.1rem",
    color: "#999",
    letterSpacing: "0.1em",
  }
}

function RecipeCard({ recipe }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : styles.card.boxShadow,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 style={styles.cardTitle}>{recipe.name}</h2>
      <p style={styles.origin}>📍 {recipe.origin}</p>
      <p style={styles.description}>{recipe.description}</p>

      <p style={styles.sectionTitle}>Zutaten</p>
      <ul style={styles.ingredientList}>
        {recipe.ingredients.map((ing, i) => (
          <li key={i} style={styles.ingredientTag}>
            {ing.name} <span style={{color: "#c8a96e"}}>{ing.menge}</span>
          </li>
        ))}
      </ul>

      <p style={styles.sectionTitle}>Zubereitung</p>
      <p style={styles.instructions}>{recipe.instructions}</p>

      <div style={styles.footer}>
        <span>🍽 {recipe.servings} Portionen</span>
      </div>
    </div>
  )
}

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes)
        setLoading(false)
      })
      .catch(err => {
        console.error("Fehler:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={styles.loading}>Rezepte werden geladen...</div>

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Rezeptplattform</h1>
        <p style={styles.headerSub}>Entdecke unsere Rezepte</p>
      </header>
      <main style={styles.main}>
        <div style={styles.grid}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App