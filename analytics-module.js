// Leeket Analytics Module - Advanced Pricing Intelligence
// Module pour analyses avancées, calculs KPIs et intelligence tarifaire

const LeeketAnalytics = {
    // Configuration des seuils et objectifs
    config: {
        thresholds: {
            foodCost: { excellent: 25, good: 30, warning: 35, critical: 40 },
            margin: { excellent: 50, good: 40, warning: 30, critical: 25 },
            waste: { excellent: 2, good: 5, warning: 8, critical: 10 },
            popularityIndex: { star: 70, average: 40, low: 20 },
            customerSatisfaction: { excellent: 4.5, good: 4.0, warning: 3.5, critical: 3.0 }
        },
        elasticity: {
            premium: -0.8,    // Plats premium moins sensibles au prix
            standard: -1.2,   // Élasticité standard
            budget: -1.8      // Plats économiques plus sensibles
        }
    },

    // Calcul des KPIs avancés
    calculateAdvancedKPIs(products, salesData = null) {
        const kpis = {
            // Food Cost Analysis
            foodCost: this.calculateFoodCost(products),

            // Margin Analysis
            margins: this.calculateMargins(products),

            // Product Performance
            performance: this.analyzePerformance(products, salesData),

            // Price Optimization
            optimization: this.calculateOptimalPrices(products),

            // Risk Indicators
            risks: this.identifyRisks(products),

            // Opportunities
            opportunities: this.identifyOpportunities(products)
        };

        return kpis;
    },

    // Analyse du Food Cost
    calculateFoodCost(products) {
        const analysis = {
            average: 0,
            byCategory: {},
            alerts: [],
            distribution: { excellent: 0, good: 0, warning: 0, critical: 0 }
        };

        products.forEach(product => {
            const foodCost = (product.cost / product.price) * 100;

            // Moyenne globale
            analysis.average += foodCost;

            // Par catégorie
            if (!analysis.byCategory[product.category]) {
                analysis.byCategory[product.category] = { total: 0, count: 0 };
            }
            analysis.byCategory[product.category].total += foodCost;
            analysis.byCategory[product.category].count++;

            // Classification
            if (foodCost <= this.config.thresholds.foodCost.excellent) {
                analysis.distribution.excellent++;
            } else if (foodCost <= this.config.thresholds.foodCost.good) {
                analysis.distribution.good++;
            } else if (foodCost <= this.config.thresholds.foodCost.warning) {
                analysis.distribution.warning++;
            } else {
                analysis.distribution.critical++;
                analysis.alerts.push({
                    product: product.name,
                    foodCost: foodCost.toFixed(1),
                    message: `Food cost critique: ${foodCost.toFixed(1)}%`
                });
            }
        });

        analysis.average = (analysis.average / products.length).toFixed(1);

        // Moyennes par catégorie
        Object.keys(analysis.byCategory).forEach(cat => {
            const catData = analysis.byCategory[cat];
            analysis.byCategory[cat] = (catData.total / catData.count).toFixed(1);
        });

        return analysis;
    },

    // Analyse des marges
    calculateMargins(products) {
        const margins = {
            gross: 0,
            contribution: 0,
            byProduct: [],
            byCategory: {},
            trends: []
        };

        products.forEach(product => {
            const grossMargin = ((product.price - product.cost) / product.price) * 100;
            const contributionMargin = product.price - product.cost;

            margins.gross += grossMargin;
            margins.contribution += contributionMargin;

            margins.byProduct.push({
                name: product.name,
                gross: grossMargin.toFixed(1),
                contribution: contributionMargin,
                index: this.calculateMarginIndex(grossMargin)
            });

            // Par catégorie
            if (!margins.byCategory[product.category]) {
                margins.byCategory[product.category] = { total: 0, count: 0 };
            }
            margins.byCategory[product.category].total += grossMargin;
            margins.byCategory[product.category].count++;
        });

        margins.gross = (margins.gross / products.length).toFixed(1);
        margins.contribution = Math.round(margins.contribution / products.length);

        // Moyennes par catégorie
        Object.keys(margins.byCategory).forEach(cat => {
            const catData = margins.byCategory[cat];
            margins.byCategory[cat] = {
                average: (catData.total / catData.count).toFixed(1),
                performance: this.getPerformanceLevel(catData.total / catData.count)
            };
        });

        return margins;
    },

    // Matrice BCG (Boston Consulting Group) pour classification produits
    analyzePerformance(products, salesData) {
        const matrix = {
            stars: [],      // Haute marge, haute popularité
            cashCows: [],   // Haute marge, popularité stable
            questions: [],  // Haute marge, faible popularité
            dogs: []        // Faible marge, faible popularité
        };

        products.forEach(product => {
            // Simuler popularité si pas de données réelles
            const popularity = salesData ?
                this.getPopularityFromSales(product, salesData) :
                Math.random() * 100;

            const margin = parseFloat(product.margin);

            // Classification BCG adaptée
            if (margin >= 40 && popularity >= 60) {
                matrix.stars.push({
                    ...product,
                    popularity,
                    recommendation: "Maintenir position premium"
                });
            } else if (margin >= 40 && popularity >= 40) {
                matrix.cashCows.push({
                    ...product,
                    popularity,
                    recommendation: "Optimiser volume"
                });
            } else if (margin >= 30) {
                matrix.questions.push({
                    ...product,
                    popularity,
                    recommendation: "Investir en marketing ou repositionner"
                });
            } else {
                matrix.dogs.push({
                    ...product,
                    popularity,
                    recommendation: "Retirer du menu ou reformuler"
                });
            }
        });

        return matrix;
    },

    // Calcul des prix optimaux
    calculateOptimalPrices(products) {
        const recommendations = [];

        products.forEach(product => {
            const currentMargin = parseFloat(product.margin);
            const foodCost = (product.cost / product.price) * 100;

            // Déterminer l'élasticité selon la catégorie
            const elasticity = this.getElasticity(product.category);

            // Prix optimal pour maximiser le profit
            const optimalPrice = this.calculateOptimalPrice(
                product.cost,
                currentMargin,
                elasticity
            );

            const priceDiff = optimalPrice - product.price;
            const priceDiffPercent = (priceDiff / product.price) * 100;

            if (Math.abs(priceDiffPercent) > 5) {
                recommendations.push({
                    product: product.name,
                    currentPrice: product.price,
                    optimalPrice: Math.round(optimalPrice / 500) * 500, // Arrondir à 500 FCFA
                    adjustment: priceDiffPercent.toFixed(1) + '%',
                    impact: this.estimateVolumeImpact(priceDiffPercent, elasticity),
                    confidence: this.getConfidenceScore(product)
                });
            }
        });

        return recommendations.sort((a, b) =>
            Math.abs(parseFloat(b.adjustment)) - Math.abs(parseFloat(a.adjustment))
        );
    },

    // Identification des risques
    identifyRisks(products) {
        const risks = {
            high: [],
            medium: [],
            low: []
        };

        products.forEach(product => {
            const foodCost = (product.cost / product.price) * 100;
            const margin = parseFloat(product.margin);

            // Risque élevé
            if (foodCost > this.config.thresholds.foodCost.critical ||
                margin < this.config.thresholds.margin.critical) {
                risks.high.push({
                    product: product.name,
                    type: 'Rentabilité critique',
                    metric: `Food cost: ${foodCost.toFixed(1)}%, Marge: ${margin}%`,
                    action: 'Action immédiate requise'
                });
            }
            // Risque moyen
            else if (foodCost > this.config.thresholds.foodCost.warning ||
                     margin < this.config.thresholds.margin.warning) {
                risks.medium.push({
                    product: product.name,
                    type: 'Rentabilité sous surveillance',
                    metric: `Food cost: ${foodCost.toFixed(1)}%, Marge: ${margin}%`,
                    action: 'Optimisation recommandée'
                });
            }
        });

        return risks;
    },

    // Identification des opportunités
    identifyOpportunities(products) {
        const opportunities = [];

        products.forEach(product => {
            const margin = parseFloat(product.margin);
            const foodCost = (product.cost / product.price) * 100;

            // Opportunité d'augmentation de prix
            if (margin > 50 && foodCost < 25) {
                opportunities.push({
                    type: 'price_increase',
                    product: product.name,
                    suggestion: 'Produit premium - augmentation prix possible',
                    potential: '+5-10%',
                    confidence: 'Haute'
                });
            }

            // Opportunité de bundle
            if (product.category === 'Boissons' && margin > 60) {
                opportunities.push({
                    type: 'bundle',
                    product: product.name,
                    suggestion: 'Créer un menu avec plat principal',
                    potential: 'AOV +20%',
                    confidence: 'Moyenne'
                });
            }

            // Opportunité de volume
            if (margin > 40 && product.price < 10000) {
                opportunities.push({
                    type: 'volume',
                    product: product.name,
                    suggestion: 'Promouvoir pour augmenter volume',
                    potential: 'Volume +30%',
                    confidence: 'Moyenne'
                });
            }
        });

        return opportunities;
    },

    // Fonctions utilitaires
    calculateOptimalPrice(cost, currentMargin, elasticity) {
        // Formule simplifiée de maximisation du profit
        // Prix optimal = Coût × (1 + 1/|élasticité|)
        return cost * (1 + 1 / Math.abs(elasticity));
    },

    estimateVolumeImpact(priceChangePercent, elasticity) {
        // Impact volume = % changement prix × élasticité
        const volumeChange = priceChangePercent * elasticity;
        return volumeChange.toFixed(1) + '%';
    },

    getElasticity(category) {
        // Retourner élasticité selon catégorie
        if (category === 'Plats principaux') return this.config.elasticity.standard;
        if (category === 'Boissons') return this.config.elasticity.budget;
        return this.config.elasticity.standard;
    },

    getConfidenceScore(product) {
        // Score de confiance basé sur la stabilité des données
        const margin = parseFloat(product.margin);
        if (margin > 45) return 'Haute';
        if (margin > 35) return 'Moyenne';
        return 'Faible';
    },

    calculateMarginIndex(margin) {
        // Index de performance de marge (0-100)
        const maxMargin = 70;
        return Math.min(100, Math.round((margin / maxMargin) * 100));
    },

    getPerformanceLevel(value, metric = 'margin') {
        const thresholds = this.config.thresholds[metric] || this.config.thresholds.margin;
        if (value >= thresholds.excellent) return 'Excellent';
        if (value >= thresholds.good) return 'Bon';
        if (value >= thresholds.warning) return 'Attention';
        return 'Critique';
    },

    getPopularityFromSales(product, salesData) {
        // Calculer popularité réelle depuis données de vente
        // Pour demo, retourner valeur aléatoire
        return Math.random() * 100;
    },

    // Export des données pour reporting
    exportAnalytics(products, format = 'json') {
        const analytics = this.calculateAdvancedKPIs(products);

        if (format === 'csv') {
            return this.convertToCSV(analytics);
        }

        return analytics;
    },

    convertToCSV(data) {
        // Conversion basique en CSV pour export
        let csv = 'Métrique,Valeur\n';
        csv += `Food Cost Moyen,${data.foodCost.average}%\n`;
        csv += `Marge Brute Moyenne,${data.margins.gross}%\n`;
        csv += `Produits Stars,${data.performance.stars.length}\n`;
        csv += `Alertes Hautes,${data.risks.high.length}\n`;
        csv += `Opportunités,${data.opportunities.length}\n`;
        return csv;
    }
};

// Export pour utilisation globale
window.LeeketAnalytics = LeeketAnalytics;