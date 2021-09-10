import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills  from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When the Bills page is loading", () => {
    test("Then the loading page must be rendered", () => {
      const html = BillsUI({ data: bills, loading: true})
      document.body.innerHTML = html
      expect(screen.queryByText("Loading...")).not.toBeNull()
    })
  })

  describe("When the Bills page has error", () => {
    test("Then the error page must be rendered", () => {
      const html = BillsUI({ data: bills, error: true })
      document.body.innerHTML = html
      expect(screen.queryByText("Erreur")).not.toBeNull()
    })

    test("Then the error message must be displayed", () => {
      const error = "My test error message"
      const html = BillsUI({ data: bills, error })
      document.body.innerHTML = html
      expect(screen.queryByText(error)).not.toBeNull()
    })
  })

  describe("When I click on the new bill button", () => {
    test("Then I should navigate to the new bill page", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html
      const onNavigate = jest.fn((pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      })
      new Bills({document, firestore: null, localStorage: window.localStorage, onNavigate })
      const newBillButton = screen.getByTestId("btn-new-bill")
      fireEvent.click(newBillButton);
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill)
      expect(screen.queryByText("Envoyer une note de frais")).not.toBeNull()
    })
  })

  describe("When I click on the eye icon on a bill", () => {
    test("Then a preview of the bill proof should be rendered", () => {
      $.fn.modal = jest.fn();

      const html = BillsUI({ data: bills });
      document.body.innerHTML = html
      new Bills({document, firestore: null, localStorage: window.localStorage, onNavigate: () => {} })
      
      const previewProofButtons = screen.getAllByTestId("icon-eye");
      
      previewProofButtons.forEach(button => {
        const imgUrl = button.getAttribute("data-bill-url")
        fireEvent.click(button);
        const proofImg = screen.getByTestId("proof")
        expect(proofImg.getAttribute("src")).toBe(imgUrl)
      })
      
    })
  })
})