import { render, screen } from "@testing-library/react"
import { ResultsHeader } from "@/components/results-header"
import "@testing-library/jest-dom"

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/predict/results",
}))

describe("ResultsHeader", () => {
  it("renders the header with correct title", () => {
    render(<ResultsHeader />)

    // Check if the title is rendered
    expect(screen.getByText("Your Health Prediction Results")).toBeInTheDocument()

    // Check if navigation links are present
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Help")).toBeInTheDocument()
  })

  it("matches snapshot", () => {
    const { container } = render(<ResultsHeader />)
    expect(container).toMatchSnapshot()
  })
})
