import { ps, e } from '/index.js'

describe('waff-query flavoured utils', () => {
  describe('ps', () => {
    it('plain div with no parameters', () => {
      const res = ps()
      chai.expect(res).to.be.deep.eq({ tag: 'div', id: undefined, className: '' })
    })

    it('plain div with empty string', () => {
      const res = ps('')
      chai.expect(res).to.be.deep.eq({ tag: 'div', id: undefined, className: '' })
    })

    it('custom tag', () => {
      const res = ps('hr')
      chai.expect(res).to.be.deep.eq({ tag: 'hr', id: undefined, className: '' })
    })

    it('cutom id with no tag', () => {
      const res = ps('#id')
      chai.expect(res).to.be.deep.eq({ tag: 'div', id: 'id', className: '' })
    })

    it('cutom id with tag', () => {
      const res = ps('meh#id')
      chai.expect(res).to.be.deep.eq({ tag: 'meh', id: 'id', className: '' })
    })

    it('class without tag and id', () => {
      const res = ps('.c1')
      chai.expect(res).to.be.deep.eq({ tag: 'div', id: undefined, className: 'c1' })
    })

    it('class without tag', () => {
      const res = ps('#i.c1')
      chai.expect(res).to.be.deep.eq({ tag: 'div', id: 'i', className: 'c1' })
    })

    it('class without id', () => {
      const res = ps('i.c1')
      chai.expect(res).to.be.deep.eq({ tag: 'i', id: undefined, className: 'c1' })
    })

    it('class with tag and id', () => {
      const res = ps('i#meh.c1')
      chai.expect(res).to.be.deep.eq({ tag: 'i', id: 'meh', className: 'c1' })
    })

    it('multiple clases', () => {
      const res = ps('i#meh.c1.c2')
      chai.expect(res).to.be.deep.eq({ tag: 'i', id: 'meh', className: 'c1 c2' })
    })
  })

  describe('e', () => {
    it('should create child elements', () => {
      const res = e('',
        e('i'),
        e('em')
      )

      chai.expect(res.childNodes.length).to.be.eq(2)
      chai.expect(res.childNodes[0]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[1]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[0].tagName).to.be.eq('I')
      chai.expect(res.childNodes[1].tagName).to.be.eq('EM')
    })

    it('should create child text nodes', () => {
      const res = e('', 'a', 'b')
      console.log(res)
      chai.expect(res.childNodes.length).to.be.eq(2)
      chai.expect(res.childNodes[0]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[1]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[0].tagName).to.be.eq('DIV')
      chai.expect(res.childNodes[1].tagName).to.be.eq('DIV')
      chai.expect(res.childNodes[0].textContent).to.be.eq('a')
      chai.expect(res.childNodes[1].textContent).to.be.eq('b')
    })

    it('should sanitize html in text children', () => {
      const res = e('', '<script>alert("xss")</script>')
      console.log(res)
      chai.expect(res.childNodes.length).to.be.eq(1)
      chai.expect(res.childNodes[0]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[0].tagName).to.be.eq('DIV')
      chai.expect(res.childNodes[0].textContent).to.be.eq('')
    })

    it('should allow a and img tags in text children', () => {
      const res = e('', '<a></a><img>')
      console.log(res)
      chai.expect(res.childNodes.length).to.be.eq(1)
      chai.expect(res.childNodes[0]).to.be.instanceof(HTMLElement)
      chai.expect(res.childNodes[0].tagName).to.be.eq('DIV')
      chai.expect(res.childNodes[0].innerHTML).to.be.eq('<a></a><img>')
    })
  })
})
