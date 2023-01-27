import { faker } from '@faker-js/faker';
import { expect } from 'chai';

const baseUrl = 'https://f4hatlr72b.execute-api.us-east-1.amazonaws.com/production'
const randomAuthor = faker.name.fullName();
const randomTitle = faker.animal.bear();
const updateTitle = faker.name.firstName();
var postResponseBookId, postResponseAuthor, postResponseTitle, deleteMessage, notFoundMassage;

describe('Bookstore - get/update/delete/get-all', () => {
   before(() => {
    cy.request('POST', baseUrl + '/books', {
        title: randomTitle,
        author: randomAuthor,
     })
        .then((response) => {
         postResponseBookId = response.body.id;
         postResponseAuthor = response.body.author;
         postResponseTitle = response.body.title;
         expect(response.status).to.eq(201)
         expect(postResponseTitle).to.eq(randomTitle)
         expect(postResponseAuthor).to.eq(randomAuthor)
         expect(postResponseBookId.length).to.eq(32)
    })
}) 

it('Get a book',() =>{
    cy.request('GET', baseUrl + '/' + postResponseBookId)
        .then((response) => {   
         expect(response.status).to.eq(200)
         expect(postResponseTitle).to.eq(randomTitle)
         expect(postResponseAuthor).to.eq(randomAuthor)
         expect(postResponseBookId.length).to.eq(32)
   })
})

it('Update a book',() =>{
    cy.request('PUT', baseUrl+ '/' + postResponseBookId, {
            title: updateTitle,
            author: randomAuthor,
        })
        .then((response) => {
        postResponseTitle = response.body.title;
         expect(response.status).to.eq(200)
         expect(postResponseTitle).to.eq(updateTitle)
         expect(postResponseAuthor).to.eq(randomAuthor)
         expect(postResponseBookId.length).to.eq(32)
        })
        cy.request('GET', baseUrl + '/' + postResponseBookId)
        .then((response) => {   
         expect(response.status).to.eq(200)
         expect(postResponseTitle).to.eq(updateTitle)
    })
})

it('Delete a book',() =>{
    cy.request('DELETE', baseUrl+ '/' + postResponseBookId) 
        .then((response) => {
         deleteMessage = response.body.message
         expect(response.status).to.eq(200)
         expect(deleteMessage).to.eq("Book was removed successfully")
    })
    cy.request({
        url: baseUrl+ '/' + postResponseBookId,
        failOnStatusCode: false,
    })
        .then((response) => {
        notFoundMassage = response.body.message;
        expect(response.status).to.eq(404)
        expect(notFoundMassage).to.eq("Not found")
        })
})
}) 