import { ReactRuntime } from "@makeswift/runtime/react"
import { List, Shape, TextInput, NumberInput, Image, Style } from "@makeswift/runtime/controls"
import { ServicesGrid } from "../ServicesGrid"
import { CommonIssues } from "../CommonIssues"
import { CompanyOverview } from "../CompanyOverview"
import { TrustIndicators } from "../TrustIndicators"
import { Reviews } from "../Reviews"

// Register all components
ReactRuntime.registerComponent(ServicesGrid, {
  type: "services-grid",
  label: "Services Grid",
  props: {
    services: List({
      label: "Services",
      type: Shape({
        title: TextInput({ label: "Title" }),
        href: TextInput({ label: "Link" }),
        iconName: TextInput({ label: "Icon Name", defaultValue: "Droplet" }),
      }),
    }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

ReactRuntime.registerComponent(CommonIssues, {
  type: "common-issues",
  label: "Common Issues",
  props: {
    issues: List({
      label: "Issues",
      type: Shape({
        title: TextInput({ label: "Title" }),
        description: TextInput({ label: "Description", multiline: true }),
        iconName: TextInput({ label: "Icon Name", defaultValue: "Clock" }),
      }),
    }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

ReactRuntime.registerComponent(CompanyOverview, {
  type: "company-overview",
  label: "Company Overview",
  props: {
    title: TextInput({ label: "Title" }),
    description: TextInput({ label: "Description", multiline: true }),
    features: List({
      label: "Features",
      type: TextInput(),
    }),
    image: Image({ label: "Image" }),
    buttonText: TextInput({ label: "Button Text" }),
    buttonLink: TextInput({ label: "Button Link" }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

ReactRuntime.registerComponent(TrustIndicators, {
  type: "trust-indicators",
  label: "Trust Indicators",
  props: {
    indicators: List({
      label: "Indicators",
      type: Shape({
        title: TextInput({ label: "Title" }),
        description: TextInput({ label: "Description", multiline: true }),
        iconName: TextInput({ label: "Icon Name", defaultValue: "Shield" }),
      }),
    }),
    buttonText: TextInput({ label: "Button Text" }),
    buttonLink: TextInput({ label: "Button Link" }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

ReactRuntime.registerComponent(Reviews, {
  type: "reviews",
  label: "Reviews Section",
  props: {
    reviews: List({
      label: "Reviews",
      type: Shape({
        author: TextInput({ label: "Author Name" }),
        rating: NumberInput({ label: "Rating", min: 1, max: 5, step: 1 }),
        text: TextInput({ label: "Review Text", multiline: true }),
        date: TextInput({ label: "Date" }),
      }),
    }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

