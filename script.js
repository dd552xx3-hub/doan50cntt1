color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.price-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 16px;
  border-radius: 14px;
  font-size: 18px;
}

.history-list {
  display: grid;
  gap: 18px;
}

.status-success {
  color: green;
  font-weight: bold;
}

.hidden {
  display: none;
}

.footer {
  background: #0f172a;
  color: white;
  text-align: center;
  padding: 24px;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .hero-overlay h1 {
    font-size: 32px;
  }

  .hero-overlay p {
    font-size: 17px;
  }

  .navbar {
    flex-direction: column;
    gap: 12px;
  }

  .navbar nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
