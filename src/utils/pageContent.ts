export interface LocalizedContentParams {
  lang: string;
  displayCity: string;
  displayState: string;
  isUs: boolean;
  currencySymbol: string;
  rateText: string;
  fedPctText: number;
  paybackText: string;
  sunHours: number;
}

export const getLocalizedContent = (params: LocalizedContentParams) => {
  const { lang, displayCity, displayState, isUs, currencySymbol, rateText, fedPctText, paybackText, sunHours } = params;
  const currentYear = 2026;

  if (lang === 'de-de') {
    return {
      seoTitle: `${displayCity}, ${displayState} Solarförderung 2026 — Berechnen Sie Ihre Amortisationszeit | IncentiveMapper`,
      seoDescription: isUs
        ? `Sparen Sie bei Solarstrom in ${displayCity}, ${displayState} mit Stromtarifen von ${currencySymbol}${rateText}/kWh. Berechnen Sie Ihre Amortisationszeit, Solareinsparungen und lokale Solarförderungen!`
        : `Sparen Sie bei Solarstrom in ${displayCity}, ${displayState} mit ${fedPctText}% Bundessteuergutschrift und Stromtarifen von ${currencySymbol}${rateText}/kWh. Geschätzte Amortisation: ${paybackText} Jahre. Berechnen Sie Ihren ROI!`,
      h1Title: `${displayCity}, ${displayState} Solar- & Energieförderung ${currentYear}`,
      introParagraph: `Mit einem durchschnittlichen Strompreis von ${currencySymbol}${rateText}/kWh und ${sunHours} Sonnenstunden pro Jahr amortisiert sich eine typische 6-kW-Solaranlage in ${displayCity}, ${displayState} in ca. ${paybackText} Jahren. Entdecken Sie unten alle aktiven Fördermittel und berechnen Sie Ihre Rendite!`
    };
  } else if (lang === 'fr-fr') {
    return {
      seoTitle: `Subventions Solaires ${displayCity}, ${displayState} 2026 — Calculez Votre Période d'Amortissement | IncentiveMapper`,
      seoDescription: isUs
        ? `Économisez sur l'énergie solaire à ${displayCity}, ${displayState} avec des tarifs d'électricité de ${currencySymbol}${rateText}/kWh. Calculez votre amortissement, vos économies et vos subventions locales!`
        : `Économisez sur l'énergie solaire à ${displayCity}, ${displayState} avec un crédit d'impôt fédéral de ${fedPctText}% et des tarifs de ${currencySymbol}${rateText}/kWh. Période d'amortissement estimée : ${paybackText} ans.`,
      h1Title: `${displayCity}, ${displayState} : Subventions Solaires & Énergétiques ${currentYear}`,
      introParagraph: `Avec un tarif moyen de ${currencySymbol}${rateText}/kWh et ${sunHours} heures d'ensoleillement par an, une installation solaire type de 6 kW à ${displayCity}, ${displayState} s'amortit en environ ${paybackText} ans. Découvrez toutes les aides et simulez votre ROI ci-dessous !`
    };
  } else {
    // Default to English
    return {
      seoTitle: `${displayCity}, ${displayState} Solar Rebates 2026 — Calculate Your Payback Period | IncentiveMapper`,
      seoDescription: isUs
        ? `Save on solar in ${displayCity}, ${displayState} with local utility rates of ${currencySymbol}${rateText}/kWh. Calculate your estimated payback, solar savings, and active rebates today!`
        : `Save on solar in ${displayCity}, ${displayState} with a ${fedPctText}% federal tax credit and utility rates of ${currencySymbol}${rateText}/kWh. Estimated payback period: ${paybackText} years. Calculate your solar ROI today!`,
      h1Title: `${displayCity}, ${displayState} Solar & Energy Rebates ${currentYear}`,
      introParagraph: `With average local utility rates of ${currencySymbol}${rateText}/kWh and ${sunHours} peak sun hours per year, a typical 6 kW solar installation in ${displayCity}, ${displayState} has an estimated payback period of ${paybackText} years. Explore active incentives and calculate your custom ROI below.`
    };
  }
};

export interface FaqSchemaParams {
  lang: string;
  displayCity: string;
  displayState: string;
  currencySymbol: string;
  rateText: string;
  sunHours: number;
  annualGenFormatted: string;
  annualSavingsFormatted: string;
  fedPctText: number;
  stRebate: number;
  utRebate: number;
  dbRebatesLength: number;
  paybackText: string;
}

export const getFaqSchema = (params: FaqSchemaParams) => {
  const { lang, displayCity, displayState, currencySymbol, rateText, sunHours, annualGenFormatted, annualSavingsFormatted, fedPctText, stRebate, utRebate, dbRebatesLength, paybackText } = params;

  if (lang === 'de-de') {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Wie viel kann ich in ${displayCity} mit Solarstrom sparen?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Durch die Installation von Solarmodulen in ${displayCity} können Sie Ihre Stromkosten erheblich senken. Bei einem lokalen Stromtarif von ${currencySymbol}${rateText}/kWh und durchschnittlich ${sunHours} Sonnenstunden pro Jahr erzeugt eine typische 6-kW-Solaranlage jährlich etwa ${annualGenFormatted} kWh Strom. Dies entspricht einer geschätzten Ersparnis von ${currencySymbol}${annualSavingsFormatted} im ersten Jahr.`
          }
        },
        {
          "@type": "Question",
          "name": `Welche Solarförderungen gibt es in ${displayState}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `In ${displayState} können Sie von verschiedenen Anreizen profitieren. Dazu gehören eine Bundessteuergutschrift von ${fedPctText}%, staatliche Zuschüsse von bis zu ${currencySymbol}${stRebate} und Fördermittel von Versorgungsunternehmen von bis zu ${currencySymbol}${utRebate}. In unserer Datenbank sind für diese Region derzeit ${dbRebatesLength} aktive Förderprogramme registriert.`
          }
        },
        {
          "@type": "Question",
          "name": `Wie lange ist die Amortisationszeit für Solarstrom in ${displayCity}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Die geschätzte Amortisationszeit für Solaranlagen in ${displayCity}, ${displayState} beträgt etwa ${paybackText} Jahre. Dies basiert auf den Nettosystemkosten nach Abzug aller anwendbaren Förderungen (wie der ${fedPctText}% Bundessteuergutschrift, staatlichen Zuschüssen von ${currencySymbol}${stRebate} und Zuschüssen von Versorgungsbetrieben von ${currencySymbol}${utRebate}) im Vergleich zu Ihren jährlichen Stromeinsparungen von ${currencySymbol}${annualSavingsFormatted}.`
          }
        },
        {
          "@type": "Question",
          "name": `Gibt es in ${displayCity} Net Metering (Netzeinspeisung)?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Ja, Netzeinspeisung oder entsprechende Einspeisevergütungen sind in ${displayCity}, ${displayState} über die lokalen Netzbetreiber verfügbar. Dadurch können Sie überschüssigen Solarstrom in das öffentliche Netz einspeisen und erhalten dafür Gutschriften oder Vergütungen, die Ihre Energiekosten weiter senken.`
          }
        }
      ]
    };
  } else if (lang === 'fr-fr') {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Combien puis-je économiser grâce au solaire à ${displayCity} ?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `L'installation de panneaux solaires à ${displayCity} permet de réduire considérablement vos factures d'électricité. Avec un tarif d'électricité local de ${currencySymbol}${rateText}/kWh et une moyenne de ${sunHours} heures d'ensoleillement par an, un système solaire standard de 6 kW produit environ ${annualGenFormatted} kWh par an, ce qui représente une économie estimée à ${currencySymbol}${annualSavingsFormatted} la première année.`
          }
        },
        {
          "@type": "Question",
          "name": `Quelles subventions solaires sont disponibles en ${displayState} ?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `En ${displayState}, vous pouvez bénéficier de plusieurs incitations financières : un crédit d'impôt de ${fedPctText}%, des subventions de l'État allant jusqu'à ${currencySymbol}${stRebate}, et des aides des fournisseurs d'énergie de ${currencySymbol}${utRebate}. Actuellement, ${dbRebatesLength} programmes d'aides actifs sont enregistrés dans notre base de données pour cette région.`
          }
        },
        {
          "@type": "Question",
          "name": `Quelle est la durée d'amortissement des panneaux solaires à ${displayCity} ?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `La période d'amortissement estimée pour une installation solaire à ${displayCity}, ${displayState} est d'environ ${paybackText} ans. Ce calcul prend en compte le coût net du système après déduction du crédit d'impôt de ${fedPctText}% et des subventions (d'une valeur de ${currencySymbol}${stRebate} pour l'État et ${currencySymbol}${utRebate} pour le fournisseur d'énergie), divisé par vos économies annuelles d'électricité de ${currencySymbol}${annualSavingsFormatted}.`
          }
        },
        {
          "@type": "Question",
          "name": `Est-ce que le net metering (facturation nette) est disponible à ${displayCity} ?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Oui, le net metering ou des dispositifs d'achat de l'électricité (comme l'obligation d'achat) sont généralement disponibles à ${displayCity}, ${displayState} via les distributeurs d'énergie locaux. Cela vous permet d'injecter votre surplus d'électricité sur le réseau en échange de crédits ou de tarifs de rachat pour réduire vos coûts.`
          }
        }
      ]
    };
  } else {
    // Default to English
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `How much can I save on solar in ${displayCity}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `By installing solar panels in ${displayCity}, you can save significantly on your electricity bills. With a local utility rate of ${currencySymbol}${rateText}/kWh and an average of ${sunHours} peak sun hours annually, a standard 6 kW solar system generates approximately ${annualGenFormatted} kWh of electricity per year. This translates to an estimated first-year savings of ${currencySymbol}${annualSavingsFormatted}.`
          }
        },
        {
          "@type": "Question",
          "name": `What solar rebates are available in ${displayState}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `In ${displayState}, you can take advantage of various solar incentives. These include a federal tax credit of ${fedPctText}%, local state rebates of up to ${currencySymbol}${stRebate}, and utility rebates of up to ${currencySymbol}${utRebate}. There are also ${dbRebatesLength} active rebate programs registered in our database for this region.`
          }
        },
        {
          "@type": "Question",
          "name": `How long is the solar payback period in ${displayCity}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The estimated solar payback period in ${displayCity}, ${displayState} is approximately ${paybackText} years. This is calculated based on the net system cost after applying the ${fedPctText}% federal tax credit, state rebates of ${currencySymbol}${stRebate}, and utility rebates of ${currencySymbol}${utRebate}, divided by your projected annual electricity savings of ${currencySymbol}${annualSavingsFormatted}.`
          }
        },
        {
          "@type": "Question",
          "name": `Does ${displayCity} have net metering?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, net metering or export billing options are typically available in ${displayCity}, ${displayState} through local utility providers. This program allows you to send surplus electricity produced by your solar panels back to the power grid, earning utility bill credits that offset your energy costs during periods of low solar generation.`
          }
        }
      ]
    };
  }
};
