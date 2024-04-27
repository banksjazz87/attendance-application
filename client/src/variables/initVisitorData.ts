export const initVisitorData = {
    form: [{
        visitorId: 1,
        id: 1,
        firstName: 'Bob',
        lastName: 'Henry',
        title: 'Mr.',
        address: '12 Sycamore Street',
        city: 'DuBois',
        state: 'PA',
        phone: '(814)-312-4567',
        email: 'heanry@gmail.com',
        contact_method: 'email',
        prayer_requests: 'I\'m having crazy stinky farts, that are causing problems in my marriage.',
        dateCreated: '12/12/2023',
    }], 
    children: [
        {
            childId: 1,
            parentId: 1,
            id: 1,
            firstName: 'Sue',
            lastName: 'Henry'
        }, 
        {
            childId: 2,
            parentId: 1,
            id: 2,
            firstName: 'Jane',
            lastName: 'Henry'
        }
    ], 
    interests: [{
        visitor_attendant_id: 1,
        interest: 'Farting Better',
    }], 
    spouse: [{
        spouseId: 2,
        visitorSpouseId: 1,
        id: 2,
        firstName: 'Marybeth',
        lastName: 'Henry'
    }]
}